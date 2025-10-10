import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InsightsPanel({ patientId }) {
  const [alerts, setAlerts] = useState([]);
  const [qualityMeasures, setQualityMeasures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [patientId]);

  const fetchInsights = async () => {
    try {
      const [alertsRes, qualityRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/insights/clinical-alerts/${patientId}`),
        axios.get(`http://localhost:3001/api/insights/quality-measures/${patientId}`)
      ]);
      
      setAlerts(alertsRes.data.alerts);
      setQualityMeasures(qualityRes.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Clinical Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Clinical Decision Support</h2>
        
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      alert.severity === 'high' ? 'text-red-800' :
                      alert.severity === 'medium' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {alert.type === 'duplicate-test' ? '🔄' : 
                       alert.type === 'missed-diagnosis' ? '🎯' : '⚠️'} 
                      {alert.message}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      alert.severity === 'high' ? 'text-red-700' :
                      alert.severity === 'medium' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      💡 {alert.recommendation}
                    </p>
                    {alert.evidence && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Evidence:</p>
                        <ul className="text-xs text-gray-600 ml-4">
                          {alert.evidence.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No clinical alerts at this time.</p>
        )}
      </div>

      {/* Quality Measures (PIQI) */}
      {qualityMeasures && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quality Measures (PIQI)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HEDIS Scores */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">HEDIS Measures</h3>
              <div className="space-y-3">
                {Object.entries(qualityMeasures.hedisScores).map(([measure, data]) => (
                  <div key={measure} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {measure.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-600">
                        Last: {new Date(data.lastCompleted).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.status === 'current' ? 'bg-green-100 text-green-800' :
                      data.status === 'due' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {data.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MIPS Scores */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">MIPS Performance</h3>
              <div className="space-y-3">
                {Object.entries(qualityMeasures.mipsScores).map(([category, score]) => (
                  <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {qualityMeasures.recommendations && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {qualityMeasures.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}