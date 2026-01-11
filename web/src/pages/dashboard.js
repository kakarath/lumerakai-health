import { useState } from 'react';

export default function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState('stroke-care');
  const [activeAgent, setActiveAgent] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [showTestResponse, setShowTestResponse] = useState(false);

  const scenarios = [
    { id: 'stroke-care', name: 'Stroke Recovery (Enhanced)', complexity: 'maximum', color: 'red' },
    { id: 'heart-failure', name: 'Heart Failure (RN Family)', complexity: 'high', color: 'blue' },
    { id: 'pediatric-asthma', name: 'Pediatric Asthma (MD Parent)', complexity: 'medium', color: 'green' },
    { id: 'cancer-care', name: 'Cancer Care (Oncology Nurse)', complexity: 'high', color: 'purple' },
    { id: 'dementia-care', name: 'Dementia Care (Geriatrician)', complexity: 'medium', color: 'yellow' },
    { id: 'spinal-injury', name: 'Spinal Injury (PT Spouse)', complexity: 'high', color: 'indigo' }
  ];

  const getScenarioData = (scenarioId) => {
    const scenarioData = {
      'stroke-care': {
        patient: '79-year-old with right hemisphere stroke',
        caregiver: 'Pre-med + Lifestyle Medicine certified',
        conditions: ['Type 2 Diabetes Mellitus', 'Hypertension', 'Dyslipidemia', 'Confabulation']
      },
      'heart-failure': {
        patient: '82-year-old with CHF',
        caregiver: 'Registered Nurse (RN) - Cardiac ICU experience',
        conditions: ['Atrial Fibrillation', 'Chronic Kidney Disease', 'COPD']
      },
      'pediatric-asthma': {
        patient: '8-year-old with severe asthma',
        caregiver: 'Pediatrician (MD) - General Pediatrics',
        conditions: ['Food allergies', 'Eczema', 'Seasonal allergies']
      },
      'cancer-care': {
        patient: '65-year-old with breast cancer',
        caregiver: 'Oncology Nurse (BSN) - Chemotherapy specialist',
        conditions: ['Stage II Breast Cancer', 'Hypertension', 'Osteoporosis']
      },
      'dementia-care': {
        patient: '78-year-old with Alzheimer\'s',
        caregiver: 'Geriatrician (MD) - Memory disorders specialist',
        conditions: ['Moderate Alzheimer\'s', 'Diabetes', 'Sleep disorders']
      },
      'spinal-injury': {
        patient: '45-year-old with T12 spinal injury',
        caregiver: 'Physical Therapist (DPT) - Spinal cord rehab',
        conditions: ['Incomplete SCI', 'Neurogenic bladder', 'Depression']
      }
    };
    return scenarioData[scenarioId] || scenarioData['stroke-care'];
  };

  const getConversationFlow = (scenarioId) => {
    const conversations = {
      'stroke-care': [
        {
          speaker: 'Expert Family Caregiver',
          message: "Mom had a stroke and was evacuated from Nigeria. She has hemiparesis, confabulation, and T2D on Metformin. Her confabulation makes her resist healthy foods and crave sweets. I'm using my pre-med background and Lifestyle Medicine certification to create high-protein, low-sugar meals, but need coordination with her medical team.",
          timestamp: '09:00',
          expertise: 'Pre-med + Lifestyle Medicine certified'
        },
        {
          speaker: 'Lumera-Doc',
          message: "Stroke with T2D + confabulation noted. Excellent that family caregiver has medical background. Coordinating Metformin timing with meal plans. Reviewing glucose monitoring protocols given cognitive changes.",
          timestamp: '09:02'
        },
        {
          speaker: 'Lumera-Nutrition',
          message: "Leveraging family caregiver's Lifestyle Medicine expertise. Confabulation + T2D requires specialized approach. Recommending Ensure Diabetes for supplementation. Creating satisfying recipes that control glucose while managing sweet cravings.",
          timestamp: '09:04'
        }
      ],
      'heart-failure': [
        {
          speaker: 'Expert Family Caregiver (RN)',
          message: "Dad's weight increased 3 lbs overnight, ankles swelling worse. As a cardiac ICU nurse with 15 years experience, I'm concerned about his Lasix effectiveness. His fluid balance seems off and we need cardiology-nephrology coordination.",
          timestamp: '08:30',
          expertise: 'Cardiac ICU RN - 15 years'
        },
        {
          speaker: 'Lumera-Doc',
          message: "CHF exacerbation noted. Excellent clinical assessment from RN family member. Coordinating diuretic adjustment with nephrology given CKD. Reviewing fluid restriction protocols.",
          timestamp: '08:32'
        }
      ]
    };
    return conversations[scenarioId] || conversations['stroke-care'];
  };

  const currentScenario = getScenarioData(selectedScenario);
  const currentConversation = getConversationFlow(selectedScenario);

  const handleTestMessage = (messageType) => {
    const testMessages = {
      'symptoms': `🚨 ALERT: Patient symptoms worsening in ${scenarios.find(s => s.id === selectedScenario)?.name}`,
      'coordination': `🔄 Coordinating specialists for ${currentScenario.patient}`,
      'expertise': `👨⚕️ Integrating ${currentScenario.caregiver} expertise into care plan`
    };
    setTestMessage(testMessages[messageType]);
    setShowTestResponse(true);
    setTimeout(() => setShowTestResponse(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          LumeraKai Health - Agent Dashboard
        </h1>
        
        {/* Scenario Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Healthcare Scenario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedScenario === scenario.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{scenario.name}</div>
                <div className={`text-sm mt-1 ${
                  scenario.complexity === 'maximum' ? 'text-red-600' :
                  scenario.complexity === 'high' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  Complexity: {scenario.complexity}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{scenarios.find(s => s.id === selectedScenario)?.name}</h2>
            <button 
              onClick={() => setShowConversation(!showConversation)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showConversation ? 'Hide' : 'Show'} Conversation
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Patient Profile</h3>
              <div className="text-sm text-gray-600 mb-2">{currentScenario.patient}</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {currentScenario.conditions.map((condition, idx) => (
                  <li key={idx}>• {condition}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Expert Family Caregiver</h3>
              <div className="text-sm text-gray-600 mb-2">{currentScenario.caregiver}</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Medical expertise integration</li>
                <li>• Professional care coordination</li>
                <li>• Real-world crisis experience</li>
              </ul>
            </div>
          </div>
        </div>

        {showConversation && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">AI Agent Conversation</h3>
            <div className="space-y-4">
              {currentConversation.map((msg, idx) => (
                <div key={idx} className="border-l-4 border-blue-400 pl-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-blue-900">{msg.speaker}</span>
                    <span className="text-sm text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{msg.message}</p>
                  {msg.expertise && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {msg.expertise}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className={`bg-blue-50 rounded-lg p-4 cursor-pointer transition-all ${
              activeAgent === 'doc' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setActiveAgent(activeAgent === 'doc' ? null : 'doc')}
          >
            <h3 className="font-semibold text-blue-900 mb-2">Lumera-Doc</h3>
            <p className="text-sm text-blue-700">
              Medical protocols, medication management, specialist coordination
            </p>
          </div>
          <div 
            className={`bg-green-50 rounded-lg p-4 cursor-pointer transition-all ${
              activeAgent === 'family' ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setActiveAgent(activeAgent === 'family' ? null : 'family')}
          >
            <h3 className="font-semibold text-green-900 mb-2">Lumera-Family</h3>
            <p className="text-sm text-green-700">
              Expert caregiver integration, family coordination, crisis prevention
            </p>
          </div>
          <div 
            className={`bg-purple-50 rounded-lg p-4 cursor-pointer transition-all ${
              activeAgent === 'guardian' ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => setActiveAgent(activeAgent === 'guardian' ? null : 'guardian')}
          >
            <h3 className="font-semibold text-purple-900 mb-2">Lumera-Guardian</h3>
            <p className="text-sm text-purple-700">
              Safety monitoring, abuse prevention, advocacy coordination
            </p>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🎯 Demo Ready - 6 Scenarios</h3>
          <p className="text-sm text-yellow-800 mb-4">
            Testing platform with diverse healthcare scenarios and expert family caregivers.
            Each demonstrates unique value of integrating family medical expertise.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button 
              onClick={() => handleTestMessage('symptoms')}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
            >
              Test: "Patient symptoms worsening"
            </button>
            <button 
              onClick={() => handleTestMessage('coordination')}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
            >
              Test: "Need specialist coordination"
            </button>
            <button 
              onClick={() => handleTestMessage('expertise')}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
            >
              Test: "Family expertise integration"
            </button>
          </div>
          {showTestResponse && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <div className="text-green-800 font-medium">{testMessage}</div>
              <div className="text-green-600 text-sm mt-1">AI agents coordinating response...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}