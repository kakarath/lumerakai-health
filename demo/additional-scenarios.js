// Additional Healthcare Scenarios for LumeraKai Testing

const additionalScenarios = {
  
  // Scenario 1: Heart Failure with Family Nurse
  heartFailure: {
    id: 'heart-failure-coordination',
    title: "Heart Failure Crisis Prevention",
    description: "82-year-old with CHF, family caregiver is RN with cardiac experience",
    urgency: 'high',
    patientProfile: {
      age: '82 years old',
      condition: 'Congestive Heart Failure (CHF)',
      comorbidities: ['Atrial Fibrillation', 'Chronic Kidney Disease', 'COPD'],
      familyCaregiverProfile: {
        background: 'Registered Nurse (RN)',
        specialization: 'Cardiac ICU experience (15 years)',
        expertise: ['Fluid management', 'Medication compliance', 'Symptom monitoring']
      }
    },
    testMessages: [
      "Dad's weight increased 3 lbs overnight, ankles swelling",
      "As an RN, I'm concerned about his Lasix effectiveness",
      "Need coordination between cardiology and nephrology"
    ]
  },

  // Scenario 2: Pediatric Asthma with Physician Parent
  pediatricAsthma: {
    id: 'pediatric-asthma-coordination',
    title: "Pediatric Asthma Management",
    description: "8-year-old with severe asthma, parent is pediatrician",
    urgency: 'medium',
    patientProfile: {
      age: '8 years old',
      condition: 'Severe Persistent Asthma',
      comorbidities: ['Food allergies', 'Eczema', 'Seasonal allergies'],
      familyCaregiverProfile: {
        background: 'Pediatrician (MD)',
        specialization: 'General Pediatrics',
        expertise: ['Asthma protocols', 'Allergy management', 'School coordination']
      }
    },
    testMessages: [
      "Peak flow dropping, need inhaler adjustment",
      "School nurse needs updated action plan",
      "Coordinating with allergist for immunotherapy"
    ]
  },

  // Scenario 3: Cancer Care with Oncology Nurse Family
  cancerCare: {
    id: 'cancer-care-coordination',
    title: "Cancer Treatment Coordination",
    description: "65-year-old with breast cancer, daughter is oncology nurse",
    urgency: 'high',
    patientProfile: {
      age: '65 years old',
      condition: 'Stage II Breast Cancer',
      comorbidities: ['Hypertension', 'Osteoporosis'],
      familyCaregiverProfile: {
        background: 'Oncology Nurse (BSN)',
        specialization: 'Chemotherapy administration',
        expertise: ['Side effect management', 'Nutrition support', 'Emotional care']
      }
    },
    testMessages: [
      "Chemo side effects worsening, nausea uncontrolled",
      "Need coordination between oncology and nutrition",
      "Managing mom's anxiety about treatment"
    ]
  },

  // Scenario 4: Dementia with Geriatrician Son
  dementiaCare: {
    id: 'dementia-care-coordination',
    title: "Dementia Care Management",
    description: "78-year-old with Alzheimer's, son is geriatrician",
    urgency: 'medium',
    patientProfile: {
      age: '78 years old',
      condition: 'Moderate Alzheimer\'s Disease',
      comorbidities: ['Diabetes', 'Hypertension', 'Sleep disorders'],
      familyCaregiverProfile: {
        background: 'Geriatrician (MD)',
        specialization: 'Memory disorders',
        expertise: ['Behavioral management', 'Medication optimization', 'Safety planning']
      }
    },
    testMessages: [
      "Mom's sundowning getting worse, wandering at night",
      "Need to adjust medications for sleep and agitation",
      "Coordinating with adult day program"
    ]
  },

  // Scenario 5: Spinal Injury with Physical Therapist Spouse
  spinalInjury: {
    id: 'spinal-injury-coordination',
    title: "Spinal Injury Rehabilitation",
    description: "45-year-old with T12 injury, spouse is physical therapist",
    urgency: 'high',
    patientProfile: {
      age: '45 years old',
      condition: 'T12 Incomplete Spinal Cord Injury',
      comorbidities: ['Neurogenic bladder', 'Pressure sores', 'Depression'],
      familyCaregiverProfile: {
        background: 'Physical Therapist (DPT)',
        specialization: 'Spinal cord rehabilitation',
        expertise: ['Mobility training', 'Equipment selection', 'Home modifications']
      }
    },
    testMessages: [
      "Pressure sore developing, need wound care coordination",
      "Wheelchair fitting needs adjustment for transfers",
      "Managing depression and motivation for therapy"
    ]
  }
};

// Test scenario selector for dashboard
const scenarioSelector = {
  scenarios: [
    { id: 'stroke-care', name: 'Stroke Recovery (Enhanced)', complexity: 'maximum' },
    { id: 'heart-failure', name: 'Heart Failure (RN Family)', complexity: 'high' },
    { id: 'pediatric-asthma', name: 'Pediatric Asthma (MD Parent)', complexity: 'medium' },
    { id: 'cancer-care', name: 'Cancer Care (Oncology Nurse)', complexity: 'high' },
    { id: 'dementia-care', name: 'Dementia Care (Geriatrician)', complexity: 'medium' },
    { id: 'spinal-injury', name: 'Spinal Injury (PT Spouse)', complexity: 'high' }
  ],
  
  getScenario: function(id) {
    switch(id) {
      case 'heart-failure': return additionalScenarios.heartFailure;
      case 'pediatric-asthma': return additionalScenarios.pediatricAsthma;
      case 'cancer-care': return additionalScenarios.cancerCare;
      case 'dementia-care': return additionalScenarios.dementiaCare;
      case 'spinal-injury': return additionalScenarios.spinalInjury;
      default: return null;
    }
  }
};

module.exports = { additionalScenarios, scenarioSelector };