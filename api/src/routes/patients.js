const express = require('express');
const { Patient, Conversation } = require('../models');
const router = express.Router();

const ALLOWED_PATIENT_FIELDS = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'email', 'fhirId'];

function pickAllowed(body, allowed) {
  return allowed.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) obj[key] = body[key];
    return obj;
  }, {});
}

router.get('/', async (req, res) => {
  try {
    const patients = await Patient.findAll({ include: [{ model: Conversation, limit: 5 }] });
    res.json(patients);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve patients' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, { include: [Conversation] });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve patient' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_PATIENT_FIELDS);
    const patient = await Patient.create(data);
    res.status(201).json(patient);
  } catch {
    res.status(400).json({ error: 'Failed to create patient' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_PATIENT_FIELDS);
    const [updated] = await Patient.update(data, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    const patient = await Patient.findByPk(req.params.id);
    res.json(patient);
  } catch {
    res.status(400).json({ error: 'Failed to update patient' });
  }
});

module.exports = router;
