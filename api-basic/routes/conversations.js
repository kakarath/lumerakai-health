const express = require('express');
const { Conversation, Patient } = require('../models');
const axios = require('axios');
const router = express.Router();

// Get all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      include: [Patient],
      order: [['createdAt', 'DESC']]
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new conversation with AI analysis
router.post('/', async (req, res) => {
  try {
    const { patientId, transcript, participants } = req.body;
    
    // Create conversation record
    const conversation = await Conversation.create({
      patientId,
      transcript,
      participants
    });

    // Send to Assistant service for analysis
    try {
      const analysisResponse = await axios.post('http://assistant:3002/analyze-conversation', {
        conversation: transcript,
        context: { patientId, participants }
      });
      
      // Update conversation with analysis
      await conversation.update({
        analysis: analysisResponse.data,
        urgencyLevel: analysisResponse.data.urgencyLevel,
        actionItems: analysisResponse.data.actionItems
      });
    } catch (analysisError) {
      console.error('Analysis failed:', analysisError.message);
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get conversation by ID
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id, {
      include: [Patient]
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;