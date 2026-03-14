import { useState, useEffect } from 'react';

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      if (!response.ok) throw new Error('Failed to create patient');
      const newPatient = await response.json();
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { patients, loading, error, createPatient, refetch: fetchPatients };
}