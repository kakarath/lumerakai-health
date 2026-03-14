const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000
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

    const response = await this.client.post('/api/generate', {
      model: this.model,
      prompt,
      stream: false,
      format: 'json',
      responseType: 'json'
    });

    const data = response.data?.response ?? response.data;
    if (typeof data === 'object' && data !== null) return data;
    // Fallback: safe string truncation, no JSON.parse on untrusted input
    const raw = typeof data === 'string' ? data.substring(0, 200) : 'Analysis unavailable';
    return {
      summary: raw,
      keyPoints: ['Analysis completed'],
      actionItems: ['Review conversation'],
      urgencyLevel: 'low',
      suggestedFollowUp: 'Follow up as needed'
    };
  }

  async generateClinicalSummary(patientData) {
    const prompt = `Generate a clinical summary for this patient data:
${JSON.stringify(patientData)}

Format as structured clinical note with sections for:
- Chief Complaint
- Assessment
- Plan
- Follow-up`;

    const response = await this.client.post('/api/generate', {
      model: this.model,
      prompt,
      stream: false
    });

    return response.data.response;
  }
}

module.exports = OllamaService;