const axios = require('axios');
const { URL } = require('url');

const ALLOWED_FHIR_PROTOCOLS = new Set(['https:', 'http:']);
const PRIVATE_RANGES = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;

function validateFHIRBase(urlString) {
  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    throw new Error('FHIR: Invalid server URL');
  }
  if (!ALLOWED_FHIR_PROTOCOLS.has(parsed.protocol)) throw new Error('FHIR: Unsupported protocol');
  if (process.env.NODE_ENV === 'production' && PRIVATE_RANGES.test(parsed.hostname)) {
    throw new Error('FHIR: Private/loopback hosts not allowed in production');
  }
  return parsed.href.replace(/\/$/, '');
}

function sanitizeId(id) {
  if (!/^[a-zA-Z0-9\-_.]{1,64}$/.test(String(id))) throw new Error('FHIR: Invalid resource ID');
  return id;
}

class FHIRService {
  constructor() {
    const rawUrl = process.env.FHIR_SERVER_URL || 'http://fhir-server:8080/fhir';
    const validatedBase = validateFHIRBase(rawUrl);
    this.client = axios.create({
      baseURL: validatedBase,
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      }
    });
  }

  async createPatient(patientData) {
    const fhirPatient = {
      resourceType: 'Patient',
      name: [{ use: 'official', family: patientData.lastName, given: [patientData.firstName] }],
      gender: patientData.gender,
      birthDate: patientData.dateOfBirth,
      telecom: [
        { system: 'phone', value: patientData.phone, use: 'mobile' },
        { system: 'email', value: patientData.email, use: 'home' }
      ]
    };
    const response = await this.client.post('/Patient', fhirPatient);
    return response.data;
  }

  async getPatient(fhirId) {
    const response = await this.client.get(`/Patient/${sanitizeId(fhirId)}`);
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
      subject: { reference: `Patient/${sanitizeId(patientId)}` },
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
      params: { subject: `Patient/${sanitizeId(patientId)}` }
    });
    return response.data;
  }
}

module.exports = FHIRService;
