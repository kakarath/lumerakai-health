const express = require('express');
const router = express.Router();

// POST /api/conversation/analyze
// Analyzes multi-party healthcare conversations
router.post('/analyze', async (req, res) => {
  try {
    const { transcript, participants, context } = req.body;
    
    // Mock conversation analysis
    const analysis = {
      summary: "Patient discussed root canal appointment on Oct 17th. Scheduling conflict identified with chiropractor appointment same day.",
      participants: participants || ['patient', 'family', 'pcp'],
      keyPoints: [
        "Root canal scheduled for October 17th",
        "Patient has no transportation",
        "Chiropractor appointment conflicts"
      ],
      recommendations: [
        "Reschedule chiropractor appointment",
        "Arrange transportation for root canal",
        "Follow up on pain management"
      ],
      fhirEvents: [
        {
          resourceType: "Appointment",
          status: "proposed",
          serviceType: "dental-surgery",
          start: "2024-10-17T10:00:00Z"
        }
      ]
    };

    res.json(analysis);
  } catch {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// POST /api/conversation/clarify
// Asks clarifying questions during conversations
router.post('/clarify', async (req, res) => {
  try {
    const { context, lastStatement } = req.body;
    
    const clarifyingQuestions = [
      "What time is your root canal appointment on October 17th?",
      "Do you have alternative transportation options?",
      "How important is keeping the chiropractor appointment the same day?"
    ];

    res.json({ questions: clarifyingQuestions });
  } catch {
    res.status(500).json({ error: 'Clarification request failed' });
  }
});

module.exports = router;