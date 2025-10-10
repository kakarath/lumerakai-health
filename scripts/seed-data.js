const { Patient, Conversation } = require('../api/src/models');

async function seedData() {
  try {
    console.log('🌱 Seeding sample data...');

    // Create sample patients
    const patients = await Patient.bulkCreate([
      {
        fhirId: 'patient-001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-05-15',
        gender: 'male',
        phone: '+1-555-0123',
        email: 'john.doe@example.com',
        medicalRecordNumber: 'MRN001',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'spouse',
          phone: '+1-555-0124'
        }
      },
      {
        fhirId: 'patient-002',
        firstName: 'Mary',
        lastName: 'Smith',
        dateOfBirth: '1975-08-22',
        gender: 'female',
        phone: '+1-555-0125',
        email: 'mary.smith@example.com',
        medicalRecordNumber: 'MRN002',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zip: '67890'
        }
      }
    ]);

    // Create sample conversations
    await Conversation.bulkCreate([
      {
        patientId: patients[0].id,
        transcript: "Patient: I've been having chest pain for the past two days. It gets worse when I exercise.\nDoctor: Can you describe the pain? Is it sharp or dull?\nPatient: It's more of a pressure feeling, like someone is sitting on my chest.\nFamily Member: He also mentioned feeling short of breath yesterday.",
        participants: ['patient', 'doctor', 'family'],
        urgencyLevel: 'high',
        status: 'active'
      },
      {
        patientId: patients[1].id,
        transcript: "Patient: I'm here for my routine checkup. I've been taking my blood pressure medication as prescribed.\nNurse: How have you been feeling overall?\nPatient: Pretty good, though I've been a bit tired lately.\nNurse: Let's check your vitals and the doctor will be in shortly.",
        participants: ['patient', 'nurse'],
        urgencyLevel: 'low',
        status: 'completed'
      }
    ]);

    console.log('✅ Sample data seeded successfully!');
    console.log(`👥 Created ${patients.length} patients`);
    console.log('💬 Created sample conversations');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

module.exports = seedData;

// Run if called directly
if (require.main === module) {
  seedData().then(() => process.exit(0));
}