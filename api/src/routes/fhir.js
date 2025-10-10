const express = require('express');
const router = express.Router();

// GET /api/fhir/patient/:id
// Retrieves patient data from FHIR server
router.get('/patient/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock FHIR patient data
    const patient = {
      resourceType: "Patient",
      id: id,
      name: [{ family: "Doe", given: ["Jane"] }],
      birthDate: "1985-03-15",
      gender: "female",
      telecom: [
        { system: "phone", value: "+1-555-0123" },
        { system: "email", value: "jane.doe@example.com" }
      ],
      address: [{
        line: ["123 Main St"],
        city: "Anytown",
        state: "MD",
        postalCode: "12345"
      }]
    };

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/fhir/appointments/:patientId
// Retrieves patient appointments
router.get('/appointments/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const appointments = {
      resourceType: "Bundle",
      entry: [
        {
          resource: {
            resourceType: "Appointment",
            id: "appt-1",
            status: "booked",
            serviceType: [{ text: "Root Canal" }],
            start: "2024-10-17T10:00:00Z",
            end: "2024-10-17T11:30:00Z",
            participant: [
              { actor: { reference: `Patient/${patientId}` } },
              { actor: { reference: "Practitioner/dentist-1" } }
            ]
          }
        }
      ]
    };

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/fhir/appointment
// Creates new appointment
router.post('/appointment', async (req, res) => {
  try {
    const appointment = req.body;
    
    // Mock appointment creation
    const createdAppointment = {
      ...appointment,
      id: `appt-${Date.now()}`,
      status: "proposed"
    };

    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;