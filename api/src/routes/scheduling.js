const express = require('express');
const router = express.Router();

// POST /api/scheduling/conflict-check
// Checks for scheduling conflicts and transportation issues
router.post('/conflict-check', async (req, res) => {
  try {
    const { patientId, proposedAppointment, patientContext } = req.body;
    
    const conflicts = [];
    const recommendations = [];

    // Mock conflict detection logic
    if (proposedAppointment.date === '2024-10-17' && patientContext.hasTransportation === false) {
      conflicts.push({
        type: 'transportation',
        severity: 'high',
        message: 'Patient has no transportation for same-day appointments'
      });
      
      recommendations.push({
        action: 'reschedule',
        reason: 'Transportation conflict',
        suggestedDates: ['2024-10-18', '2024-10-19']
      });
    }

    res.json({
      hasConflicts: conflicts.length > 0,
      conflicts,
      recommendations
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/scheduling/optimize
// Optimizes appointment scheduling based on patient context
router.post('/optimize', async (req, res) => {
  try {
    const { patientId, appointments, constraints } = req.body;
    
    const optimizedSchedule = {
      patientId,
      optimizations: [
        {
          originalDate: '2024-10-17',
          optimizedDate: '2024-10-18',
          reason: 'Consolidated appointments to reduce transportation burden'
        }
      ],
      estimatedTimeSaved: '2 hours',
      transportationCostReduction: '$25'
    };

    res.json(optimizedSchedule);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;