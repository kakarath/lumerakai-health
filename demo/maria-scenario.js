// Maria's Care Coordination Demo Scenario
// Patient: Maria, 58, diabetes + dental surgery scheduled

const { LumeraOrchestrator } = require('../agents/src/lumeraAgents');
const AIRouter = require('../assistant/src/services/aiRouter');

class MariaScenarioDemo {
  constructor() {
    this.aiRouter = new AIRouter();
    this.orchestrator = new LumeraOrchestrator(this.aiRouter);
    this.patientContext = {
      patientId: 'maria-001',
      name: 'Maria Rodriguez',
      age: 58,
      conditions: ['Type 2 Diabetes'],
      medications: ['Metformin 500mg'],
      appointments: [
        { date: '2024-10-17', time: '10:00', provider: 'Dr. Smith - Dentist', type: 'Dental Surgery' },
        { date: '2024-10-17', time: '14:00', provider: 'Dr. Johnson - Chiropractor', type: 'Adjustment' }
      ],
      allergies: ['Penicillin'],
      emergencyContact: 'Carlos Rodriguez (husband)'
    };
  }

  async runDemo() {
    console.log('🏥 LumeraKai Health - Maria\'s Care Coordination Demo');
    console.log('=' .repeat(60));
    
    // Scenario: Maria reports scheduling conflict
    const mariaMessage = "I can't come in Thursday; I have dental surgery and I'm worried about the pain medication affecting my diabetes.";
    
    console.log('👩 Maria:', mariaMessage);
    console.log('\n🤖 LumeraKai Agents Processing...\n');
    
    try {
      const response = await this.orchestrator.processPatientMessage(mariaMessage, this.patientContext);
      
      this.displayAgentResponses(response);
      this.displayCoordinatedActions(response);
      this.displayNextSteps(response);
      
    } catch (error) {
      console.error('❌ Demo Error:', error.message);
    }
  }

  displayAgentResponses(response) {
    console.log('🤖 Agent Responses:');
    console.log('-'.repeat(40));
    
    Object.entries(response.agentResponses).forEach(([agent, agentResponse]) => {
      console.log(`\n${this.getAgentEmoji(agent)} ${agent}:`);
      if (agentResponse.summary) {
        console.log(`   Summary: ${agentResponse.summary}`);
      }
      if (agentResponse.urgencyLevel) {
        console.log(`   Urgency: ${agentResponse.urgencyLevel.toUpperCase()}`);
      }
      if (agentResponse.actionItems) {
        console.log(`   Actions: ${agentResponse.actionItems.join(', ')}`);
      }
    });
  }

  displayCoordinatedActions(response) {
    if (response.coordinatedAction.length > 0) {
      console.log('\n🔄 Coordinated Actions:');
      console.log('-'.repeat(40));
      response.coordinatedAction.forEach(action => {
        console.log(`   • ${action}`);
      });
    }
  }

  displayNextSteps(response) {
    if (response.nextSteps.length > 0) {
      console.log('\n📋 Next Steps:');
      console.log('-'.repeat(40));
      response.nextSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. [${step.agent}] ${step.action}`);
      });
    }
  }

  getAgentEmoji(agent) {
    const emojis = {
      'Lumera-Doc': '👨⚕️',
      'Lumera-Nurse': '👩⚕️',
      'Lumera-Patient': '💬',
      'Lumera-Admin': '📅',
      'Lumera-Pharmacy': '💊'
    };
    return emojis[agent] || '🤖';
  }
}

// Run demo if called directly
if (require.main === module) {
  const demo = new MariaScenarioDemo();
  demo.runDemo().then(() => {
    console.log('\n✅ Demo completed successfully!');
    console.log('🌟 LumeraKai Health - Illuminating care through intelligence');
  });
}

module.exports = MariaScenarioDemo;