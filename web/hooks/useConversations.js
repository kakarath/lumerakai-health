import { useState, useEffect } from 'react';

export function useConversations(patientId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchConversations();
    } else {
      setConversations([]);
    }
  }, [patientId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations?patientId=${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data.filter(conv => conv.patientId === patientId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (conversationData) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversationData)
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      const newConversation = await response.json();
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { conversations, loading, error, createConversation, refetch: fetchConversations };
}