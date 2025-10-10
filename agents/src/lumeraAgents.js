class LumeraAgent {
  constructor(role, aiRouter) {
    this.role = role;
    this.aiRouter = aiRouter;
    this.capabilities = this.getCapabilities();
  }

  async processMessage(message, context) {
    const prompt = this.buildPrompt(message, context);
    return await this.aiRouter.analyzeConversation(prompt, { ...context, agent: this.role });
  }

  buildPrompt(message, context) {
    return `You are ${this.role}, a specialized healthcare AI agent.

Your capabilities: ${this.capabilities.join(', ')}

Message: ${message}
Context: ${JSON.stringify(context)}

Respond as ${this.role} would, focusing on your specialized role in the care team.`;
  }

  getCapabilities() {
    const capabilities = {
      'Lumera-Doc': [
        'Diagnostic reasoning',
        'Clinical decision support',
        'Medication review',
        'Risk assessment',
        'Treatment recommendations'
      ],
      'Lumera-Nurse': [
        'Care coordination',
        'Follow-up scheduling',
        'Vital signs monitoring',
        'Patient education',
        'Care plan execution'
      ],
      'Lumera-Patient': [
        'Patient communication',
        'Health education',
        'Symptom interpretation',
        'Appointment reminders',
        'Family liaison'
      ],
      'Lumera-Admin': [
        'Scheduling optimization',
        'Resource allocation',
        'Insurance verification',
        'Logistics coordination',
        'Workflow management'
      ],
      'Lumera-Pharmacy': [
        'Medication management',
        'Drug interaction checking',
        'Formulary verification',
        'Adherence monitoring',
        'Cost optimization'
      ]
    };
    return capabilities[this.role] || [];
  }
}

class LumeraOrchestrator {
  constructor(aiRouter) {
    this.agents = {
      'Lumera-Doc': new LumeraAgent('Lumera-Doc', aiRouter),
      'Lumera-Nurse': new LumeraAgent('Lumera-Nurse', aiRouter),
      'Lumera-Patient': new LumeraAgent('Lumera-Patient', aiRouter),
      'Lumera-Admin': new LumeraAgent('Lumera-Admin', aiRouter),
      'Lumera-Pharmacy': new LumeraAgent('Lumera-Pharmacy', aiRouter)
    };
  }

  async processPatientMessage(message, patientContext) {
    // Route to appropriate agents based on message content
    const relevantAgents = this.identifyRelevantAgents(message);
    const responses = {};

    for (const agentRole of relevantAgents) {
      responses[agentRole] = await this.agents[agentRole].processMessage(message, patientContext);
    }

    return this.synthesizeResponses(responses, message);
  }

  identifyRelevantAgents(message) {
    const agents = ['Lumera-Patient']; // Always include patient agent
    
    if (message.includes('appointment') || message.includes('schedule')) {
      agents.push('Lumera-Admin');
    }
    if (message.includes('medication') || message.includes('prescription')) {
      agents.push('Lumera-Pharmacy');
    }
    if (message.includes('symptoms') || message.includes('pain')) {
      agents.push('Lumera-Doc', 'Lumera-Nurse');
    }
    
    return [...new Set(agents)];
  }

  synthesizeResponses(responses, originalMessage) {
    return {
      timestamp: new Date().toISOString(),
      originalMessage,
      agentResponses: responses,
      coordinatedAction: this.determineCoordinatedAction(responses),
      nextSteps: this.generateNextSteps(responses)
    };
  }

  determineCoordinatedAction(responses) {
    // Logic to determine if agents need to coordinate
    const actions = [];
    
    if (responses['Lumera-Admin'] && responses['Lumera-Doc']) {
      actions.push('Schedule coordination with clinical review');
    }
    if (responses['Lumera-Pharmacy'] && responses['Lumera-Doc']) {
      actions.push('Medication review with prescriber');
    }
    
    return actions;
  }

  generateNextSteps(responses) {
    const steps = [];
    
    Object.entries(responses).forEach(([agent, response]) => {
      if (response.actionItems) {
        steps.push(...response.actionItems.map(item => ({ agent, action: item })));
      }
    });
    
    return steps;
  }
}

module.exports = { LumeraAgent, LumeraOrchestrator };