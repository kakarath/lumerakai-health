class SpecializedAgent {
  constructor(specialty, aiRouter) {
    this.specialty = specialty;
    this.aiRouter = aiRouter;
  }

  async processConversation(transcript, context) {
    const specialtyPrompt = this.getSpecialtyPrompt(transcript, context);
    return await this.aiRouter.analyzeConversation(specialtyPrompt, context);
  }

  getSpecialtyPrompt(transcript, context) {
    const basePrompt = `As a ${this.specialty} specialist AI assistant, analyze this conversation:

${transcript}

Context: ${JSON.stringify(context)}`;

    return basePrompt + this.getSpecialtySpecificGuidance();
  }

  getSpecialtySpecificGuidance() {
    const guidance = {
      'primary-care': `
Focus on: Preventive care, care coordination, referral needs, medication management.
Alert for: Overdue screenings, medication interactions, specialist follow-up needs.`,
      
      'cardiology': `
Focus on: Cardiac symptoms, medication compliance, lifestyle factors, risk stratification.
Alert for: Chest pain urgency, medication adjustments, cardiac testing needs.`,
      
      'pharmacy': `
Focus on: Medication availability, insurance coverage, drug interactions, adherence.
Alert for: Formulary issues, cost concerns, timing conflicts, side effects.`,
      
      'family-liaison': `
Focus on: Family concerns, communication gaps, care coordination, emotional support.
Alert for: Misunderstandings, scheduling conflicts, caregiver burden.`,
      
      'insurance-navigator': `
Focus on: Coverage verification, prior authorizations, cost optimization.
Alert for: Uncovered services, alternative options, appeal opportunities.`
    };

    return guidance[this.specialty] || '';
  }
}

class AgentOrchestrator {
  constructor(aiRouter) {
    this.agents = {
      'primary-care': new SpecializedAgent('primary-care', aiRouter),
      'cardiology': new SpecializedAgent('cardiology', aiRouter),
      'pharmacy': new SpecializedAgent('pharmacy', aiRouter),
      'family-liaison': new SpecializedAgent('family-liaison', aiRouter),
      'insurance-navigator': new SpecializedAgent('insurance-navigator', aiRouter)
    };
  }

  async routeToSpecialists(transcript, context) {
    const relevantAgents = this.identifyRelevantAgents(transcript, context);
    const results = {};

    for (const agentType of relevantAgents) {
      results[agentType] = await this.agents[agentType].processConversation(transcript, context);
    }

    return results;
  }

  identifyRelevantAgents(transcript, context) {
    const agents = ['family-liaison']; // Always include family liaison
    
    if (transcript.includes('medication') || transcript.includes('prescription')) {
      agents.push('pharmacy');
    }
    if (transcript.includes('insurance') || transcript.includes('coverage')) {
      agents.push('insurance-navigator');
    }
    if (context.specialty) {
      agents.push(context.specialty);
    } else {
      agents.push('primary-care');
    }

    return [...new Set(agents)];
  }
}

module.exports = { SpecializedAgent, AgentOrchestrator };