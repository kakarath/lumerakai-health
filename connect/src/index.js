require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const FHIRService = require('./services/fhirService');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());

const fhirService = new FHIRService();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'lumerakai-connect' });
});

// FHIR Patient endpoints
app.post('/fhir/patients', async (req, res) => {
  try {
    const patient = await fhirService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fhir/patients/:id', async (req, res) => {
  try {
    const patient = await fhirService.getPatient(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(404).json({ error: 'Patient not found' });
  }
});

app.get('/fhir/patients', async (req, res) => {
  try {
    const patients = await fhirService.searchPatients(req.query);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FHIR Observation endpoints
app.post('/fhir/observations', async (req, res) => {
  try {
    const { patientId, ...observationData } = req.body;
    const observation = await fhirService.createObservation(patientId, observationData);
    res.status(201).json(observation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fhir/patients/:id/observations', async (req, res) => {
  try {
    const observations = await fhirService.getPatientObservations(req.params.id);
    res.json(observations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔗 LumeraKai Connect running on port ${PORT}`);
});