const OpenAI = require('openai');

class ConversationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateClarifyingQuestion(analysis) {
    const prompt = `
Based on this healthcare conversation analysis, generate a helpful clarifying question:

Context: ${analysis.context}
Key Points: ${analysis.keyPoints.join(', ')}
Uncertainty: ${analysis.uncertainty}

Generate a single, clear question that would help clarify the situation for better care coordination.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful healthcare AI assistant that asks clarifying questions to improve patient care coordination. Be concise and empathetic."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return {
        question: response.choices[0].message.content.trim(),
        context: analysis.context,
        priority: analysis.priority || 'medium'
      };
    } catch (error) {
      console.error('Error generating clarifying question:', error);
      return {
        question: "Could you provide more details about the scheduling preferences?",
        context: analysis.context,
        priority: 'low'
      };
    }
  }

  async processVoiceInput(audioData) {
    // Placeholder for voice processing
    // In production, this would use Whisper or similar
    return "Voice processing not implemented yet";
  }

  async generateClinicalSummary(conversationHistory) {
    const prompt = `
Summarize this healthcare conversation for clinical documentation:

Conversation: ${conversationHistory}

Provide:
1. Key medical information discussed
2. Patient concerns or symptoms
3. Care coordination needs
4. Follow-up actions required
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a medical documentation assistant. Create concise, accurate clinical summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating clinical summary:', error);
      return "Unable to generate summary at this time.";
    }
  }
}

module.exports = ConversationService;