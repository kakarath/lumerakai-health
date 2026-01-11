import { useState, useEffect, useRef } from 'react';

export function useAgentWebSocket() {
  const [agents, setAgents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002');
        
        ws.current.onopen = () => {
          setIsConnected(true);
          console.log('Connected to LumeraKai agents');
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleMessage(data);
        };

        ws.current.onclose = () => {
          setIsConnected(false);
          console.log('Disconnected from agents');
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        // Fallback to mock data for demo
        initializeMockData();
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleMessage = (data) => {
    switch (data.type) {
      case 'AGENT_STATUS_UPDATE':
        setAgents(prev => {
          const updated = prev.filter(a => a.type !== data.agent.type);
          return [...updated, data.agent];
        });
        break;

      case 'AGENT_MESSAGE':
        setConversations(prev => [...prev, {
          id: Date.now(),
          agent: data.agent,
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
          scenario: data.scenario
        }]);
        break;

      case 'SCENARIO_STARTED':
        setConversations([]);
        setAgents(data.agents || []);
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      // Mock response for demo when WebSocket is not available
      handleMockMessage(message);
    }
  };

  const handleMockMessage = (message) => {
    if (message.type === 'START_SCENARIO') {
      // Simulate scenario start
      setTimeout(() => {
        setConversations([]);
        setAgents([
          { type: 'Lumera-Doc', status: 'active' },
          { type: 'Lumera-Nurse', status: 'active' },
          { type: 'Lumera-Patient', status: 'active' },
          { type: 'Lumera-Admin', status: 'thinking' },
          { type: 'Lumera-Pharmacy', status: 'inactive' }
        ]);

        // Simulate agent conversations
        const mockConversations = getMockConversations(message.scenario);
        mockConversations.forEach((conv, index) => {
          setTimeout(() => {
            setConversations(prev => [...prev, {
              id: Date.now() + index,
              agent: conv.agent,
              message: conv.message,
              timestamp: new Date().toLocaleTimeString(),
              scenario: message.scenario
            }]);
          }, (index + 1) * 2000);
        });
      }, 500);
    }

    if (message.type === 'USER_MESSAGE') {
      // Simulate agent response to user message
      setTimeout(() => {
        const responses = [
          { agent: 'Lumera-Patient', message: `I understand your concern: "${message.message}". Let me coordinate with the care team.` },
          { agent: 'Lumera-Doc', message: 'Based on the patient input, I recommend reviewing the current care plan.' },
          { agent: 'Lumera-Admin', message: 'I can help coordinate any scheduling or logistics needs.' }
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setConversations(prev => [...prev, {
          id: Date.now(),
          agent: randomResponse.agent,
          message: randomResponse.message,
          timestamp: new Date().toLocaleTimeString(),
          scenario: message.scenario
        }]);
      }, 1000);
    }
  };

  const getMockConversations = (scenarioId) => {
    const scenarios = {
      'maria-dental': [
        { agent: 'Lumera-Patient', message: "I can't come Thursday; I have dental surgery and I'm worried about the pain medication affecting my diabetes." },
        { agent: 'Lumera-Admin', message: 'I see you have a chiropractor appointment the same day. Let me check for conflicts.' },
        { agent: 'Lumera-Doc', message: 'Reviewing medication interactions between dental pain management and diabetes medications.' },
        { agent: 'Lumera-Pharmacy', message: 'I recommend acetaminophen instead of NSAIDs to avoid blood sugar complications.' },
        { agent: 'Lumera-Nurse', message: 'I can coordinate with both providers to reschedule and ensure proper care continuity.' }
      ],
      'emergency-chest-pain': [
        { agent: 'Lumera-Patient', message: 'I have severe chest pain and shortness of breath. My family is very worried.' },
        { agent: 'Lumera-Doc', message: 'Initiating emergency protocol. Ordering EKG and cardiac enzymes immediately.' },
        { agent: 'Lumera-Nurse', message: 'Vitals obtained. Blood pressure elevated, heart rate 110. Starting IV access.' },
        { agent: 'Lumera-Admin', message: 'Cardiac bed available. Notifying cardiology team for consultation.' },
        { agent: 'Lumera-Patient', message: 'Keeping family informed of all procedures and expected timeline.' }
      ],
      'chronic-diabetes': [
        { agent: 'Lumera-Patient', message: 'My blood sugars have been running high lately, and I have questions about my medications.' },
        { agent: 'Lumera-Doc', message: 'Reviewing recent A1C results and current medication regimen for optimization.' },
        { agent: 'Lumera-Pharmacy', message: 'Checking for drug interactions and adherence patterns in medication history.' },
        { agent: 'Lumera-Admin', message: 'Coordinating appointments with endocrinologist and diabetes educator.' },
        { agent: 'Lumera-Nurse', message: 'Scheduling follow-up for diabetes management education and monitoring.' }
      ]
    };

    return scenarios[scenarioId] || [];
  };

  const initializeMockData = () => {
    setIsConnected(true); // Show as connected for demo
    setAgents([
      { type: 'Lumera-Doc', status: 'inactive' },
      { type: 'Lumera-Nurse', status: 'inactive' },
      { type: 'Lumera-Patient', status: 'inactive' },
      { type: 'Lumera-Admin', status: 'inactive' },
      { type: 'Lumera-Pharmacy', status: 'inactive' }
    ]);
  };

  return {
    agents,
    conversations,
    isConnected,
    sendMessage
  };
}