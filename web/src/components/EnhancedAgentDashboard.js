import { useState, useEffect } from 'react';
import { useAgentWebSocket } from '../hooks/useAgentWebSocket';

const EnhancedAgentDashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const { agents, conversations, sendMessage, isConnected } = useAgentWebSocket();

  const scenarios = [
    {
      id: 'stroke-care-coordination',
      title: "Stroke Recovery Crisis Prevention",
      description: "Right hemisphere ischemic attack with hemiparesis, confabulation, and elder abuse history",
      participants: ['patient', 'family', 'doctor', 'nurse', 'pt', 'ot', 'speech', 'guardian'],
      urgency: 'high',
      complexity: 'maximum',
      realWorld: true,
      icon: '🧠'
    },
    {
      id: 'maria-dental',
      title: "Maria's Scheduling Conflict",
      description: "Diabetes patient with dental surgery scheduling conflict",
      participants: ['patient', 'doctor', 'admin'],
      urgency: 'medium',
      complexity: 'moderate',
      icon: '🦷'
    },
    {
      id: 'emergency-chest-pain',
      title: "Emergency Room Triage",
      description: "65-year-old with chest pain, anxious family",
      participants: ['patient', 'family', 'doctor', 'nurse'],
      urgency: 'high',
      complexity: 'high',
      icon: '🚨'
    },
    {
      id: 'chronic-diabetes',
      title: "Chronic Care Coordination",
      description: "Multi-specialist diabetes management",
      participants: ['patient', 'pcp', 'endocrinologist', 'pharmacist'],
      urgency: 'low',
      complexity: 'moderate',
      icon: '💊'
    }
  ];

  const getAgentColor = (agentType) => {
    const colors = {
      'Lumera-Doc': 'bg-blue-600',
      'Lumera-Nurse': 'bg-green-600',
      'Lumera-Patient': 'bg-purple-600',
      'Lumera-Family': 'bg-pink-600',
      'Lumera-Rehab': 'bg-orange-600',
      'Lumera-Guardian': 'bg-red-600',
      'Lumera-Social': 'bg-indigo-600',
      'Lumera-Admin': 'bg-yellow-600',
      'Lumera-Pharmacy': 'bg-teal-600'
    };
    return colors[agentType] || 'bg-gray-600';
  };

  const getComplexityBadge = (complexity) => {
    const badges = {
      'maximum': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'moderate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[complexity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LumeraKai Health - Enhanced Agent Dashboard
          </h1>
          <p className="text-gray-600">
            AI that prevents healthcare crises through intelligent coordination
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'AI Agents Connected' : 'Disconnected'}
            </div>
            <div className="text-sm text-gray-500">
              🌐 Live at: <a href="https://lumerakai.ai" className="text-indigo-600 hover:underline">lumerakai.ai</a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Scenario Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Healthcare Scenarios</h2>
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedScenario?.id === scenario.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{scenario.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                          {scenario.realWorld && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              Real Experience
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scenario.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          scenario.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {scenario.urgency}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityBadge(scenario.complexity)}`}>
                          {scenario.complexity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.participants.slice(0, 4).map((participant) => (
                        <span key={participant} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {participant}
                        </span>
                      ))}
                      {scenario.participants.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{scenario.participants.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Agent Status */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">AI Agent Status</h2>
              <div className="space-y-3">
                {[
                  { name: 'Lumera-Doc', role: 'Clinical Decision Support' },
                  { name: 'Lumera-Nurse', role: 'Care Coordination' },
                  { name: 'Lumera-Family', role: 'Family Communication' },
                  { name: 'Lumera-Rehab', role: 'Therapy Coordination' },
                  { name: 'Lumera-Guardian', role: 'Safety Monitoring' },
                  { name: 'Lumera-Social', role: 'Discharge Planning' }
                ].map((agent) => {
                  const isActive = selectedScenario?.id === 'stroke-care-coordination';
                  return (
                    <div key={agent.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <span className="font-medium text-sm">{agent.name}</span>
                          <p className="text-xs text-gray-500">{agent.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">
                        {isActive ? 'active' : 'standby'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Conversation Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 h-[600px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Agent Coordination</h2>
                {selectedScenario && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedScenario.icon}</span>
                    <span className="font-medium">{selectedScenario.title}</span>
                  </div>
                )}
              </div>
              
              {selectedScenario ? (
                <div className="h-full flex flex-col">
                  {selectedScenario.realWorld && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="text-blue-600 font-medium">💡 Real-World Validation</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        This scenario is based on actual family experience with stroke care coordination, 
                        elder abuse prevention, and multi-generational caregiver support.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {conversations.map((conversation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAgentColor(conversation.agent)}`}>
                          {conversation.agent.split('-')[1]?.[0] || conversation.agent[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{conversation.agent}</span>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{conversation.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Enhanced Input Area */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Ask about the scenario or add new information..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                        🎤
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Try: "What if the patient has medication allergies?" or "How do you prevent caregiver burnout?"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="text-6xl mb-4">🧠</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Healthcare Scenario
                    </h3>
                    <p className="text-gray-500">
                      Choose a scenario to see AI agents coordinate care and prevent crises
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAgentDashboard;