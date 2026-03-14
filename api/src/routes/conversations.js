const express = require('express');
const { Conversation, Patient } = require('../models');
const axios = require('axios');
const router = express.Router();

const ALLOWED_CONVERSATION_FIELDS = ['patientId', 'transcript', 'participants'];
const ASSISTANT_URL = process.env.ASSISTANT_SERVICE_URL || 'http://assistant:3002';

function pickAllowed(body, allowed) {
  return allowed.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(body, key)) obj[key] = body[key];
    return obj;
  }, {});
}

router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      include: [Patient],
      order: [['createdAt', 'DESC']]
    });
    res.json(conversations);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientId, transcript, participants } = pickAllowed(req.body, ALLOWED_CONVERSATION_FIELDS);
    const conversation = await Conversation.create({ patientId, transcript, participants });

    try {
      const analysisResponse = await axios.post(`${ASSISTANT_URL}/analyze-conversation`, {
        conversation: transcript,
        context: { patientId, participants }
      });
      await conversation.update({
        analysis: analysisResponse.data,
        urgencyLevel: analysisResponse.data.urgencyLevel,
        actionItems: analysisResponse.data.actionItems
      });
    } catch (analysisError) {
      console.error('Analysis failed:', analysisError.message);
    }

    res.status(201).json(conversation);
  } catch {
    res.status(400).json({ error: 'Failed to create conversation' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id, { include: [Patient] });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    res.json(conversation);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
});

module.exports = router;
