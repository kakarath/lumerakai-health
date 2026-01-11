// EHR Integration Module - Epic, Cerner, Allscripts
class EHRIntegration {
  constructor(ehrType, credentials) {
    this.ehrType = ehrType;
    this.credentials = credentials;
    this.fhirEndpoint = this.getFHIREndpoint(ehrType);
  }

  getFHIREndpoint(ehrType) {
    const endpoints = {
      'epic': 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
      'cerner': 'https://fhir-open.cerner.com/r4',
      'allscripts': 'https://fhir.allscripts.com/fhir/r4'
    };
    return endpoints[ehrType];
  }

  // Get Patient Data
  async getPatient(patientId) {
    const response = await fetch(`${this.fhirEndpoint}/Patient/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${this.credentials.access_token}`,
        'Accept': 'application/fhir+json'
      }
    });
    return await response.json();
  }

  // Get Stroke Conditions
  async getStrokeConditions(patientId) {
    const response = await fetch(`${this.fhirEndpoint}/Condition?patient=${patientId}&code=230690007`, {
      headers: {
        'Authorization': `Bearer ${this.credentials.access_token}`,
        'Accept': 'application/fhir+json'
      }
    });
    return await response.json();
  }

  // Create Care Plan with Family Expertise
  async createCarePlan(patientId, caregiverData) {
    const carePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      subject: { reference: `Patient/${patientId}` },
      title: 'Stroke Recovery with Family Expertise',
      careTeam: [{ reference: `RelatedPerson/${caregiverData.id}` }]
    };

    const response = await fetch(`${this.fhirEndpoint}/CarePlan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.access_token}`,
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(carePlan)
    });
    return await response.json();
  }
}

module.exports = EHRIntegration;