// FHIR Integration for Stroke Care Coordination
// Handles stroke care protocols, T2D management, and family caregiver integration

const { URL } = require('url');

const ALLOWED_RESOURCE_TYPES = new Set([
  'Patient', 'Condition', 'MedicationRequest', 'CarePlan', 'RelatedPerson'
]);

// Validated base URLs keyed by instance — never tainted by user input
const _baseUrls = new WeakMap();

function validateAndStore(instance, serverUrl) {
  const parsed = new URL(serverUrl);
  if (parsed.protocol !== 'https:') throw new Error('FHIR: Only HTTPS endpoints allowed');
  const privateRanges = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;
  if (privateRanges.test(parsed.hostname)) throw new Error('FHIR: Private/loopback hosts not allowed');
  _baseUrls.set(instance, parsed.href.replace(/\/$/, ''));
}

function getBase(instance) {
  return _baseUrls.get(instance);
}

function sanitizeId(id) {
  if (!/^[a-zA-Z0-9\-_.]{1,64}$/.test(id)) throw new Error('FHIR: Invalid resource ID format');
  return id;
}

class FHIRStrokeIntegration {
  constructor(fhirServerUrl) {
    validateAndStore(this, fhirServerUrl);
    this.headers = {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json'
    };
  }

  async createStrokePatient(patientData) {
    return this.createResource({
      resourceType: 'Patient',
      identifier: [{ system: 'http://lumerakai.ai/patient-id', value: patientData.id }],
      name: [{ family: patientData.lastName, given: [patientData.firstName] }],
      birthDate: patientData.birthDate,
      gender: patientData.gender
    });
  }

  async createStrokeCondition(patientId, strokeData) {
    return this.createResource({
      resourceType: 'Condition',
      subject: { reference: `Patient/${sanitizeId(patientId)}` },
      code: { coding: [{ system: 'http://snomed.info/sct', code: '230690007', display: 'Cerebrovascular accident' }] },
      bodySite: [{ coding: [{ system: 'http://snomed.info/sct', code: '7771000', display: 'Right cerebral hemisphere structure' }] }],
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
      onsetDateTime: strokeData.onsetDate
    });
  }

  async createT2DCondition(patientId) {
    return this.createResource({
      resourceType: 'Condition',
      subject: { reference: `Patient/${sanitizeId(patientId)}` },
      code: { coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Type 2 diabetes mellitus' }] },
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] }
    });
  }

  async createComorbidities(patientId) {
    const pid = sanitizeId(patientId);
    return Promise.all([
      this.createResource({
        resourceType: 'Condition',
        subject: { reference: `Patient/${pid}` },
        code: { coding: [{ system: 'http://snomed.info/sct', code: '38341003', display: 'Hypertensive disorder' }] },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] }
      }),
      this.createResource({
        resourceType: 'Condition',
        subject: { reference: `Patient/${pid}` },
        code: { coding: [{ system: 'http://snomed.info/sct', code: '370992007', display: 'Dyslipidemia' }] },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] }
      })
    ]);
  }

  async createMetforminMedication(patientId) {
    return this.createResource({
      resourceType: 'MedicationRequest',
      subject: { reference: `Patient/${sanitizeId(patientId)}` },
      medicationCodeableConcept: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '6809', display: 'Metformin' }] },
      status: 'active',
      intent: 'order',
      dosageInstruction: [{ text: 'Take with meals to reduce GI effects', timing: { repeat: { frequency: 2, period: 1, periodUnit: 'd' } } }]
    });
  }

  async createFamilyCaregiver(patientId, caregiverData) {
    return this.createResource({
      resourceType: 'RelatedPerson',
      patient: { reference: `Patient/${sanitizeId(patientId)}` },
      relationship: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode', code: 'CHILD', display: 'Child' }] }],
      name: [{ family: caregiverData.lastName, given: [caregiverData.firstName] }],
      extension: [{ url: 'http://lumerakai.ai/medical-expertise', valueString: 'Pre-med certification, Lifestyle Medicine certified' }]
    });
  }

  async createStrokeCarePlan(patientId, caregiverId) {
    return this.createResource({
      resourceType: 'CarePlan',
      subject: { reference: `Patient/${sanitizeId(patientId)}` },
      status: 'active',
      intent: 'plan',
      title: 'Stroke Recovery with T2D Management',
      description: 'Coordinated care plan integrating family medical expertise',
      careTeam: [{ reference: `RelatedPerson/${caregiverId}` }],
      activity: [
        { detail: { code: { coding: [{ system: 'http://snomed.info/sct', code: '182836005', display: 'Medication review' }] }, status: 'in-progress', description: 'Coordinate Metformin timing with meals for confabulation management' } },
        { detail: { code: { coding: [{ system: 'http://snomed.info/sct', code: '410155007', display: 'Occupational therapy' }] }, status: 'in-progress', description: 'Therapeutic massage for left-side hypersensitivity' } },
        { detail: { code: { coding: [{ system: 'http://snomed.info/sct', code: '182836005', display: 'Nutritional counseling' }] }, status: 'in-progress', description: 'T2D nutrition management with confabulation considerations' } }
      ]
    });
  }

  async createResource(resource) {
    if (!ALLOWED_RESOURCE_TYPES.has(resource.resourceType)) {
      throw new Error(`FHIR: Unsupported resource type: ${resource.resourceType}`);
    }
    const url = `${getBase(this)}/${resource.resourceType}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(resource)
      });
      if (!response.ok) throw new Error(`FHIR API error: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('FHIR integration error:', error);
      throw error;
    }
  }

  async searchPatient(patientId) {
    const url = `${getBase(this)}/Patient/${sanitizeId(patientId)}`;
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) throw new Error(`Patient not found: ${response.status}`);
    return response.json();
  }
}

module.exports = FHIRStrokeIntegration;
