import { useState, useEffect } from 'react';
import { useAgentWebSocket } from '../hooks/useAgentWebSocket';

const AgentDashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const { agents, conversations, sendMessage, isConnected } = useAgentWebSocket();

  const scenarios = [
    {
      id: 'maria-dental',
      title: "Maria's Scheduling Conflict",
      description: "Diabetes patient with dental surgery scheduling conflict",
      participants: ['patient', 'doctor', 'admin'],
      urgency: 'medium'
    },
    {
      id: 'emergency-chest-pain',
      title: "Emergency Room Triage",
      description: "65-year-old with chest pain, anxious family",
      participants: ['patient', 'family', 'doctor', 'nurse'],
      urgency: 'high'
    },
    {
      id: 'chronic-diabetes',
      title: "Chronic Care Coordination",
      description: "Multi-specialist diabetes management",
      participants: ['patient', 'pcp', 'endocrinologist', 'pharmacist'],
      urgency: 'low'
    }
  ];

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    // Initialize scenario with agents
    sendMessage({
      type: 'START_SCENARIO',
      scenario: scenario.id,
      participants: scenario.participants
    });
  };

  const getAgentStatus = (agentType) => {
    const agent = agents.find(a => a.type === agentType);
    return agent?.status || 'inactive';
  };

  const getAgentColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'thinking': return 'bg-yellow-500';
      case 'responding': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LumeraKai Health - Agent Dashboard
          </h1>
          <p className="text-gray-600">
            Interactive multi-agent healthcare coordination demo
          </p>
          <div className="mt-2 flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected to AI agents' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Select Scenario</h2>
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(scenario)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedScenario?.id === scenario.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scenario.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        scenario.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {scenario.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.participants.map((participant) => (
                        <span key={participant} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Status */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
              <div className="space-y-3">
                {['Lumera-Doc', 'Lumera-Nurse', 'Lumera-Patient', 'Lumera-Admin', 'Lumera-Pharmacy'].map((agentType) => {
                  const status = getAgentStatus(agentType);
                  return (
                    <div key={agentType} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${getAgentColor(status)}`}></div>
                        <span className="font-medium">{agentType}</span>
                      </div>
                      <span className="text-sm text-gray-500 capitalize">{status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 h-96">
              <h2 className="text-xl font-semibold mb-4">Agent Conversations</h2>
              {selectedScenario ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {conversations.map((conversation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          conversation.agent === 'Lumera-Doc' ? 'bg-blue-600' :
                          conversation.agent === 'Lumera-Nurse' ? 'bg-green-600' :
                          conversation.agent === 'Lumera-Patient' ? 'bg-purple-600' :
                          conversation.agent === 'Lumera-Admin' ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}>
                          {conversation.agent.split('-')[1][0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{conversation.agent}</span>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <p className="text-gray-700">{conversation.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Input Area */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type a message or voice command..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            sendMessage({
                              type: 'USER_MESSAGE',
                              message: e.target.value,
                              scenario: selectedScenario.id
                            });
                            e.target.value = '';
                          }
                        }}
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        🎤
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a scenario to begin agent interaction
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;