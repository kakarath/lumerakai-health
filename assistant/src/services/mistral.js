const axios = require('axios');

class MistralService {
  constructor() {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY is required');
    }
    this.client = axios.create({
      baseURL: 'https://api.mistral.ai/v1',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async analyzeConversation(conversationText, context = {}) {
    const prompt = `As a healthcare AI assistant, analyze this conversation between patient, family, and care team:

Conversation: ${conversationText}

Context: ${JSON.stringify(context)}

Provide analysis in JSON format:
{
  "summary": "Brief summary",
  "keyPoints": ["point1", "point2"],
  "actionItems": ["action1", "action2"],
  "urgencyLevel": "low|medium|high",
  "suggestedFollowUp": "recommendation"
}`;

    const response = await this.client.post('/chat/completions', {
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.data.choices[0].message.content);
  }

  async generateClinicalSummary(patientData) {
    const prompt = `Generate a clinical summary for this patient data:
${JSON.stringify(patientData)}

Format as structured clinical note with sections for:
- Chief Complaint
- Assessment
- Plan
- Follow-up`;

    const response = await this.client.post('/chat/completions', {
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }]
    });

    return response.data.choices[0].message.content;
  }
}

module.exports = MistralService;