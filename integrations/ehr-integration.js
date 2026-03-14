// EHR Integration Module - Epic, Cerner, Allscripts

const { URL } = require('url');

const ALLOWED_EHR_HOSTS = new Set([
  'fhir.epic.com',
  'fhir-open.cerner.com',
  'fhir.allscripts.com'
]);

const EHR_ENDPOINTS = {
  epic: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
  cerner: 'https://fhir-open.cerner.com/r4',
  allscripts: 'https://fhir.allscripts.com/fhir/r4'
};

// Validated base URLs keyed by instance — never tainted by user input
const _baseUrls = new WeakMap();

function validateAndStore(instance, ehrType) {
  const raw = EHR_ENDPOINTS[ehrType];
  if (!raw) throw new Error(`EHR: Unknown EHR type: ${ehrType}`);
  const parsed = new URL(raw);
  if (parsed.protocol !== 'https:') throw new Error('EHR: Only HTTPS endpoints allowed');
  if (!ALLOWED_EHR_HOSTS.has(parsed.hostname)) throw new Error(`EHR: Host not in allowlist: ${parsed.hostname}`);
  _baseUrls.set(instance, parsed.href.replace(/\/$/, ''));
}

function getBase(instance) {
  return _baseUrls.get(instance);
}

function sanitizeId(id) {
  if (!/^[a-zA-Z0-9\-_.]{1,64}$/.test(id)) throw new Error('EHR: Invalid resource ID format');
  return id;
}

class EHRIntegration {
  constructor(ehrType, credentials) {
    this.ehrType = ehrType;
    this.credentials = credentials;
    validateAndStore(this, ehrType);
  }

  async getPatient(patientId) {
    const url = `${getBase(this)}/Patient/${sanitizeId(patientId)}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.credentials.access_token}`,
        'Accept': 'application/fhir+json'
      }
    });
    return response.json();
  }

  async getStrokeConditions(patientId) {
    const url = `${getBase(this)}/Condition?patient=${sanitizeId(patientId)}&code=230690007`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.credentials.access_token}`,
        'Accept': 'application/fhir+json'
      }
    });
    return response.json();
  }

  async createCarePlan(patientId, caregiverData) {
    const url = `${getBase(this)}/CarePlan`;
    const carePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      subject: { reference: `Patient/${sanitizeId(patientId)}` },
      title: 'Stroke Recovery with Family Expertise',
      careTeam: [{ reference: `RelatedPerson/${caregiverData.id}` }]
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.access_token}`,
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(carePlan)
    });
    return response.json();
  }
}

module.exports = EHRIntegration;
