import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SchedulingPanel({ patientId }) {
  const [appointments, setAppointments] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [optimizations, setOptimizations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedulingData();
  }, [patientId]);

  const fetchSchedulingData = async () => {
    try {
      const appointmentsRes = await axios.get(`http://localhost:3001/api/fhir/appointments/${patientId}`);
      setAppointments(appointmentsRes.data.entry || []);
      
      // Check for conflicts
      await checkConflicts();
    } catch (error) {
      console.error('Error fetching scheduling data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkConflicts = async () => {
    try {
      const conflictRes = await axios.post('http://localhost:3001/api/scheduling/conflict-check', {
        patientId,
        proposedAppointment: { date: '2024-10-17' },
        patientContext: { hasTransportation: false }
      });
      
      if (conflictRes.data.hasConflicts) {
        setConflicts(conflictRes.data.conflicts);
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  const optimizeSchedule = async () => {
    try {
      const optimizeRes = await axios.post('http://localhost:3001/api/scheduling/optimize', {
        patientId,
        appointments: appointments.map(a => a.resource),
        constraints: { transportation: 'limited' }
      });
      
      setOptimizations(optimizeRes.data);
    } catch (error) {
      console.error('Error optimizing schedule:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading scheduling data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Conflict Alerts */}
      {conflicts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-red-600">⚠️ Scheduling Conflicts</h2>
          
          <div className="space-y-4">
            {conflicts.map((conflict, index) => (
              <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-red-800">
                      {conflict.type === 'transportation' ? '🚗' : '📅'} {conflict.message}
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Severity: {conflict.severity}
                    </p>
                  </div>
                  <button
                    onClick={optimizeSchedule}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Optimize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Current Appointments</h2>
        
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((entry, index) => {
              const appointment = entry.resource;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {appointment.serviceType?.[0]?.text || 'Medical Appointment'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📅 {new Date(appointment.start).toLocaleDateString()} at{' '}
                        {new Date(appointment.start).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`font-medium ${
                          appointment.status === 'booked' ? 'text-green-600' :
                          appointment.status === 'proposed' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {appointment.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No appointments scheduled.</p>
        )}
      </div>

      {/* Schedule Optimizations */}
      {optimizations && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-600">✨ Schedule Optimizations</h2>
          
          <div className="space-y-4">
            {optimizations.optimizations.map((opt, index) => (
              <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800">
                  Suggested Change: {opt.originalDate} → {opt.optimizedDate}
                </h3>
                <p className="text-sm text-green-700 mt-1">{opt.reason}</p>
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800">Benefits</h3>
              <ul className="text-sm text-blue-700 mt-2">
                <li>• Time saved: {optimizations.estimatedTimeSaved}</li>
                <li>• Cost reduction: {optimizations.transportationCostReduction}</li>
              </ul>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Apply Optimizations
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Review Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50">
            <div className="text-center">
              <span className="text-2xl">📅</span>
              <p className="mt-2 text-sm font-medium">Schedule New Appointment</p>
            </div>
          </button>
          
          <button 
            onClick={checkConflicts}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50"
          >
            <div className="text-center">
              <span className="text-2xl">⚠️</span>
              <p className="mt-2 text-sm font-medium">Check Conflicts</p>
            </div>
          </button>
          
          <button 
            onClick={optimizeSchedule}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50"
          >
            <div className="text-center">
              <span className="text-2xl">✨</span>
              <p className="mt-2 text-sm font-medium">Optimize Schedule</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}