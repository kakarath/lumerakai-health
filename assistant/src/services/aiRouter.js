const GeminiService = require('./gemini');
const OllamaService = require('./ollama');
const MistralService = require('./mistral');

class AIRouter {
  constructor() {
    this.providers = [];
    this.currentIndex = 0;
    
    // Initialize available providers
    if (process.env.GOOGLE_API_KEY) {
      this.providers.push({ name: 'google', service: new GeminiService() });
    }
    if (process.env.OLLAMA_URL) {
      this.providers.push({ name: 'ollama', service: new OllamaService() });
    }
    if (process.env.MISTRAL_API_KEY) {
      this.providers.push({ name: 'mistral', service: new MistralService() });
    }
    
    this.rotationEnabled = process.env.AI_ROTATION_ENABLED === 'true';
  }

  getNextProvider() {
    if (!this.rotationEnabled || this.providers.length === 1) {
      return this.providers[0];
    }
    
    const provider = this.providers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.providers.length;
    return provider;
  }

  getProviderStats() {
    return {
      available: this.providers.map(p => p.name),
      current: this.providers[this.currentIndex]?.name,
      rotationEnabled: this.rotationEnabled
    };
  }

  async analyzeConversation(conversationText, context = {}) {
    const provider = this.getNextProvider();
    console.log(`Using ${provider.name} for conversation analysis`);
    
    try {
      return await provider.service.analyzeConversation(conversationText, context);
    } catch (error) {
      console.error(`${provider.name} failed:`, error.message);
      
      // Fallback to next provider if available
      if (this.providers.length > 1) {
        const fallback = this.getNextProvider();
        console.log(`Falling back to ${fallback.name}`);
        return await fallback.service.analyzeConversation(conversationText, context);
      }
      throw error;
    }
  }

  async generateClinicalSummary(patientData) {
    const provider = this.getNextProvider();
    console.log(`Using ${provider.name} for clinical summary`);
    
    try {
      return await provider.service.generateClinicalSummary(patientData);
    } catch (error) {
      console.error(`${provider.name} failed:`, error.message);
      
      if (this.providers.length > 1) {
        const fallback = this.getNextProvider();
        console.log(`Falling back to ${fallback.name}`);
        return await fallback.service.generateClinicalSummary(patientData);
      }
      throw error;
    }
  }
}

module.exports = AIRouter;