const axios = require('axios');

class FHIRService {
  constructor() {
    this.baseURL = process.env.FHIR_SERVER_URL || 'http://fhir-server:8080/fhir';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      }
    });
  }

  async createPatient(patientData) {
    const fhirPatient = {
      resourceType: 'Patient',
      name: [{
        use: 'official',
        family: patientData.lastName,
        given: [patientData.firstName]
      }],
      gender: patientData.gender,
      birthDate: patientData.dateOfBirth,
      telecom: [
        {
          system: 'phone',
          value: patientData.phone,
          use: 'mobile'
        },
        {
          system: 'email',
          value: patientData.email,
          use: 'home'
        }
      ]
    };

    const response = await this.client.post('/Patient', fhirPatient);
    return response.data;
  }

  async getPatient(fhirId) {
    const response = await this.client.get(`/Patient/${fhirId}`);
    return response.data;
  }

  async searchPatients(params = {}) {
    const response = await this.client.get('/Patient', { params });
    return response.data;
  }

  async createObservation(patientId, observationData) {
    const fhirObservation = {
      resourceType: 'Observation',
      status: 'final',
      subject: {
        reference: `Patient/${patientId}`
      },
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: observationData.code,
          display: observationData.display
        }]
      },
      valueString: observationData.value,
      effectiveDateTime: new Date().toISOString()
    };

    const response = await this.client.post('/Observation', fhirObservation);
    return response.data;
  }

  async getPatientObservations(patientId) {
    const response = await this.client.get('/Observation', {
      params: { subject: `Patient/${patientId}` }
    });
    return response.data;
  }
}

module.exports = FHIRService;