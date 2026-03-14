const express = require('express');
const router = express.Router();

// GET /api/insights/clinical-alerts/:patientId
// Provides clinical decision support alerts
router.get('/clinical-alerts/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const alerts = [
      {
        id: 'alert-1',
        type: 'duplicate-test',
        severity: 'medium',
        message: 'Patient had similar blood work 2 weeks ago. Consider if repeat is necessary.',
        recommendation: 'Review previous results before ordering',
        evidence: ['Lab results from 2024-10-03']
      },
      {
        id: 'alert-2',
        type: 'missed-diagnosis',
        severity: 'high',
        message: 'Symptoms suggest possible sleep apnea. Consider sleep study.',
        recommendation: 'Add sleep apnea to differential diagnosis',
        evidence: ['Reported snoring', 'Daytime fatigue', 'BMI > 30']
      }
    ];

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/insights/quality-measures/:patientId
// PIQI - Patient Intelligence & Quality Insights
router.get('/quality-measures/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const qualityInsights = {
      hedisScores: {
        diabeticEyeExam: { status: 'due', lastCompleted: '2023-08-15' },
        mammographyScreening: { status: 'current', lastCompleted: '2024-09-01' },
        colonoscopyScreening: { status: 'overdue', lastCompleted: '2019-05-20' }
      },
      mipsScores: {
        qualityScore: 85,
        improvementActivities: 75,
        promotingInteroperability: 90
      },
      recommendations: [
        'Schedule diabetic eye exam within 30 days',
        'Urgent: Colonoscopy screening is 5 years overdue'
      ]
    };

    res.json(qualityInsights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/insights/wellness-followup
// Generates wellness follow-up recommendations
router.post('/wellness-followup', async (req, res) => {
  try {
    const { patientId, lastVisit, conditions } = req.body;
    
    const followUpPlan = {
      nextAppointment: {
        recommended: '2024-11-15',
        type: 'routine-followup',
        duration: 30
      },
      reminders: [
        'Blood pressure medication refill due in 2 weeks',
        'Annual physical due in 3 months',
        'Flu shot recommended for this season'
      ],
      lifestyle: [
        'Continue daily walks as discussed',
        'Monitor blood sugar levels twice daily',
        'Follow Mediterranean diet plan'
      ]
    };

    res.json(followUpPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;