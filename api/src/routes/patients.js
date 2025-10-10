const express = require('express');
const { Patient, Conversation } = require('../models');
const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{ model: Conversation, limit: 5 }]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [Conversation]
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Patient.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const patient = await Patient.findByPk(req.params.id);
      res.json(patient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;