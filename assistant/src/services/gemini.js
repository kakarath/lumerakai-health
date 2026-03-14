const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeConversation(conversationText, context = {}) {
    const prompt = `
As a healthcare AI assistant, analyze this conversation between patient, family, and care team:

Conversation: ${conversationText}

Context: ${JSON.stringify(context)}

Provide analysis in JSON format:
{
  "summary": "Brief summary",
  "keyPoints": ["point1", "point2"],
  "actionItems": ["action1", "action2"],
  "urgencyLevel": "low|medium|high",
  "suggestedFollowUp": "recommendation"
}
`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    let parsed;
    try { parsed = JSON.parse(response.text()); } catch {
      throw new Error('Gemini: Response was not valid JSON');
    }
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Gemini: Unexpected response structure');
    return parsed;
  }

  async generateClinicalSummary(patientData) {
    const prompt = `
Generate a clinical summary for this patient data:
${JSON.stringify(patientData)}

Format as structured clinical note with sections for:
- Chief Complaint
- Assessment
- Plan
- Follow-up
`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

module.exports = GeminiService;