import { useState, useEffect } from 'react';
import Head from 'next/head';
import PatientList from '../components/PatientList';
import ConversationPanel from '../components/ConversationPanel';
import { usePatients } from '../hooks/usePatients';

export default function Home() {
  const { patients, loading, error } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <>
      <Head>
        <title>LumeraKai Health - Illuminating care through intelligence</title>
        <meta name="description" content="AI-powered healthcare platform" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  LumeraKai Health
                </h1>
                <span className="ml-2 text-sm text-gray-500">
                  Illuminating care through intelligence
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Google AI Active (28-day limit)
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <div className="lg:col-span-1">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Patients
                    </h3>
                    <PatientList 
                      patients={patients}
                      loading={loading}
                      error={error}
                      onSelectPatient={setSelectedPatient}
                      selectedPatient={selectedPatient}
                    />
                  </div>
                </div>
              </div>

              {/* Conversation Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <ConversationPanel patient={selectedPatient} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}