// LumeraKai Mobile App - Family Caregiver Interface
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

function DashboardScreen() {
  const [alerts] = useState([
    { id: 1, type: 'urgent', message: 'Mom\'s glucose reading high (180)', time: '2 min ago' },
    { id: 2, type: 'info', message: 'PT session scheduled for 2pm', time: '1 hour ago' }
  ]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Care Dashboard
      </Text>
      
      <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
          Mom - Stroke Recovery
        </Text>
        <Text style={{ color: '#666' }}>Last vitals: 2 hours ago</Text>
        <Text style={{ color: '#666' }}>Next medication: Metformin in 30 min</Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
        AI Agent Alerts
      </Text>
      {alerts.map(alert => (
        <TouchableOpacity 
          key={alert.id}
          style={{ 
            backgroundColor: alert.type === 'urgent' ? '#fee2e2' : '#eff6ff',
            padding: 15, 
            borderRadius: 10, 
            marginBottom: 10 
          }}
        >
          <Text style={{ fontWeight: '600' }}>{alert.message}</Text>
          <Text style={{ color: '#666', fontSize: 12 }}>{alert.time}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default DashboardScreen;