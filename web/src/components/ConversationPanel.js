import { useState, useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';

export default function ConversationPanel({ patient }) {
  const { conversations, createConversation, loading } = useConversations(patient?.id);
  const [newConversation, setNewConversation] = useState('');
  const [participants, setParticipants] = useState(['patient']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newConversation.trim() || !patient) return;

    await createConversation({
      patientId: patient.id,
      transcript: newConversation,
      participants
    });

    setNewConversation('');
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (!patient) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">
          Select a patient to view conversations
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 pb-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Conversations - {patient.firstName} {patient.lastName}
        </h3>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(conversation.urgencyLevel)}`}>
                  {conversation.urgencyLevel} priority
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(conversation.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-700 whitespace-pre-wrap">
                {conversation.transcript}
              </p>
            </div>

            {conversation.analysis && (
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                {conversation.analysis.summary && (
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Summary:</strong> {conversation.analysis.summary}
                  </p>
                )}
                {conversation.analysis.keyPoints?.length > 0 && (
                  <div className="text-sm text-blue-800 mb-2">
                    <strong>Key Points:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {conversation.analysis.keyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {conversation.analysis.actionItems?.length > 0 && (
                  <div className="text-sm text-blue-800">
                    <strong>Action Items:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {conversation.analysis.actionItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No conversations yet. Start by adding one below.
          </div>
        )}
      </div>

      {/* New Conversation Form */}
      <div className="flex-shrink-0 pt-4 border-t">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participants
            </label>
            <div className="flex space-x-2">
              {['patient', 'family', 'doctor', 'nurse'].map((role) => (
                <label key={role} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={participants.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setParticipants([...participants, role]);
                      } else {
                        setParticipants(participants.filter(p => p !== role));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-1 text-sm text-gray-700 capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <textarea
              value={newConversation}
              onChange={(e) => setNewConversation(e.target.value)}
              placeholder="Enter conversation transcript..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !newConversation.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Add Conversation'}
          </button>
        </form>
      </div>
    </div>
  );
}