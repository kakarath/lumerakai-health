// FHIR Integration for Stroke Care Coordination
// Handles stroke care protocols, T2D management, and family caregiver integration

class FHIRStrokeIntegration {
  constructor(fhirServerUrl) {
    this.fhirServerUrl = fhirServerUrl;
    this.headers = {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json'
    };
  }

  // Create stroke patient with comorbidities
  async createStrokePatient(patientData) {
    const patient = {
      resourceType: 'Patient',
      identifier: [{
        system: 'http://lumerakai.ai/patient-id',
        value: patientData.id
      }],
      name: [{
        family: patientData.lastName,
        given: [patientData.firstName]
      }],
      birthDate: patientData.birthDate,
      gender: patientData.gender
    };

    return await this.createResource(patient);
  }

  // Create stroke condition with SNOMED codes
  async createStrokeCondition(patientId, strokeData) {
    const condition = {
      resourceType: 'Condition',
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '230690007', // Stroke (disorder)
          display: 'Cerebrovascular accident'
        }]
      },
      bodySite: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '7771000', // Right cerebral hemisphere
          display: 'Right cerebral hemisphere structure'
        }]
      }],
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }]
      },
      onsetDateTime: strokeData.onsetDate
    };

    return await this.createResource(condition);
  }

  // Create T2D comorbidity
  async createT2DCondition(patientId) {
    const condition = {
      resourceType: 'Condition',
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '44054006', // Type 2 diabetes mellitus
          display: 'Type 2 diabetes mellitus'
        }]
      },
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }]
      }
    };

    return await this.createResource(condition);
  }

  // Create hypertension and dyslipidemia
  async createComorbidities(patientId) {
    const hypertension = {
      resourceType: 'Condition',
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '38341003', // Hypertensive disorder
          display: 'Hypertensive disorder'
        }]
      },
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }]
      }
    };

    const dyslipidemia = {
      resourceType: 'Condition',
      subject: { reference: `Patient/${patientId}` },
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '370992007', // Dyslipidemia
          display: 'Dyslipidemia'
        }]
      },
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }]
      }
    };

    return Promise.all([
      this.createResource(hypertension),
      this.createResource(dyslipidemia)
    ]);
  }

  // Create Metformin medication
  async createMetforminMedication(patientId) {
    const medication = {
      resourceType: 'MedicationRequest',
      subject: { reference: `Patient/${patientId}` },
      medicationCodeableConcept: {
        coding: [{
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: '6809', // Metformin
          display: 'Metformin'
        }]
      },
      status: 'active',
      intent: 'order',
      dosageInstruction: [{
        text: 'Take with meals to reduce GI effects',
        timing: {
          repeat: {
            frequency: 2,
            period: 1,
            periodUnit: 'd'
          }
        }
      }]
    };

    return await this.createResource(medication);
  }

  // Create family caregiver as RelatedPerson
  async createFamilyCaregiver(patientId, caregiverData) {
    const relatedPerson = {
      resourceType: 'RelatedPerson',
      patient: { reference: `Patient/${patientId}` },
      relationship: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v3-RoleCode',
          code: 'CHILD', // Adult child
          display: 'Child'
        }]
      }],
      name: [{
        family: caregiverData.lastName,
        given: [caregiverData.firstName]
      }],
      extension: [{
        url: 'http://lumerakai.ai/medical-expertise',
        valueString: 'Pre-med certification, Lifestyle Medicine certified'
      }]
    };

    return await this.createResource(relatedPerson);
  }

  // Create care plan for stroke recovery
  async createStrokeCarePlan(patientId, caregiverId) {
    const carePlan = {
      resourceType: 'CarePlan',
      subject: { reference: `Patient/${patientId}` },
      status: 'active',
      intent: 'plan',
      title: 'Stroke Recovery with T2D Management',
      description: 'Coordinated care plan integrating family medical expertise',
      careTeam: [{ reference: `RelatedPerson/${caregiverId}` }],
      activity: [
        {
          detail: {
            code: {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '182836005', // Review of medication
                display: 'Medication review'
              }]
            },
            status: 'in-progress',
            description: 'Coordinate Metformin timing with meals for confabulation management'
          }
        },
        {
          detail: {
            code: {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '410155007', // Occupational therapy
                display: 'Occupational therapy'
              }]
            },
            status: 'in-progress',
            description: 'Therapeutic massage for left-side hypersensitivity'
          }
        },
        {
          detail: {
            code: {
              coding: [{
                system: 'http://snomed.info/sct',
                code: '182836005', // Nutritional counseling
                display: 'Nutritional counseling'
              }]
            },
            status: 'in-progress',
            description: 'T2D nutrition management with confabulation considerations'
          }
        }
      ]
    };

    return await this.createResource(carePlan);
  }

  // Generic FHIR resource creation
  async createResource(resource) {
    try {
      const response = await fetch(`${this.fhirServerUrl}/${resource.resourceType}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(resource)
      });

      if (!response.ok) {
        throw new Error(`FHIR API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('FHIR integration error:', error);
      throw error;
    }
  }

  // Search for patient resources
  async searchPatient(patientId) {
    const response = await fetch(`${this.fhirServerUrl}/Patient/${patientId}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Patient not found: ${response.status}`);
    }

    return await response.json();
  }
}

module.exports = FHIRStrokeIntegration;