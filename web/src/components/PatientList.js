import { useState } from 'react';

export default function PatientList({ patients, loading, error, onSelectPatient, selectedPatient }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients?.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Error loading patients: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No patients found
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedPatient?.id === patient.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    MRN: {patient.medicalRecordNumber || 'N/A'}
                  </p>
                </div>
                {patient.Conversations?.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {patient.Conversations.length} conversations
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}