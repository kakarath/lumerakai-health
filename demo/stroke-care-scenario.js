// Stroke Care Coordination Scenario - Based on Real Experience
// Patient: Elderly mother with right hemisphere ischemic attack

const strokeCareScenario = {
  id: 'stroke-care-coordination',
  title: "Stroke Recovery Crisis Prevention",
  description: "Right hemisphere ischemic attack patient with hemiparesis, confabulation, and complex family dynamics",
  participants: ['patient', 'family', 'doctor', 'nurse', 'pt', 'ot', 'speech', 'social-worker'],
  urgency: 'high',
  complexity: 'maximum',
  
  patientProfile: {
    age: 'elderly',
    condition: 'Right hemisphere ischemic attack',
    symptoms: ['Hemiparesis', 'Confabulation', 'Cognitive changes'],
    complications: ['Elder abuse history', 'Multiple family caregivers', 'Complex medication regimen'],
    location: 'International medical evacuation required'
  },

  careTeam: {
    'Lumera-Doc': {
      focus: 'Stroke recovery protocols, medication management, prognosis',
      alerts: ['Drug interactions', 'Recovery milestones', 'Complication prevention']
    },
    'Lumera-Nurse': {
      focus: 'Daily care coordination, family education, progress monitoring',
      alerts: ['Medication compliance', 'Therapy attendance', 'Family stress levels']
    },
    'Lumera-Rehab': {
      focus: 'PT/OT/Speech therapy scheduling and progress coordination',
      alerts: ['Therapy conflicts', 'Progress plateaus', 'Equipment needs']
    },
    'Lumera-Family': {
      focus: 'Multi-generational communication, caregiver support, crisis prevention',
      alerts: ['Caregiver burnout', 'Family conflicts', 'Communication breakdowns']
    },
    'Lumera-Guardian': {
      focus: 'Elder abuse prevention, safety monitoring, advocacy',
      alerts: ['Abuse indicators', 'Neglect signs', 'Unsafe situations']
    },
    'Lumera-Social': {
      focus: 'Discharge planning, home care coordination, resource navigation',
      alerts: ['Insurance issues', 'Home safety', 'Support service gaps']
    }
  },

  conversationFlow: [
    {
      speaker: 'Family Member',
      message: "Mom had a stroke and was evacuated from Nigeria. She has hemiparesis and confabulation. We're overwhelmed and don't know how to coordinate all the different therapies and appointments.",
      timestamp: '09:00',
      urgency: 'high'
    },
    {
      speaker: 'Lumera-Doc',
      message: "Right hemisphere stroke with hemiparesis and confabulation noted. Initiating comprehensive stroke recovery protocol. Coordinating with rehabilitation team for immediate assessment.",
      timestamp: '09:02',
      actions: ['Order PT/OT/Speech evaluations', 'Review medication regimen', 'Schedule follow-up imaging']
    },
    {
      speaker: 'Lumera-Guardian',
      message: "Elder abuse history detected. Implementing safety monitoring protocols. Ensuring all caregivers are properly vetted and supervised.",
      timestamp: '09:03',
      actions: ['Document abuse history', 'Set up monitoring system', 'Coordinate with social services']
    },
    {
      speaker: 'Lumera-Rehab',
      message: "Scheduling coordinated PT/OT/Speech therapy sessions. Avoiding conflicts with medical appointments. Setting up progress tracking system.",
      timestamp: '09:05',
      actions: ['Schedule therapy evaluations', 'Coordinate transportation', 'Set up progress metrics']
    },
    {
      speaker: 'Lumera-Family',
      message: "I see multiple family members involved in care. Setting up communication system to reduce stress and prevent conflicts. Providing caregiver support resources.",
      timestamp: '09:07',
      actions: ['Create family communication plan', 'Provide caregiver resources', 'Schedule family meetings']
    },
    {
      speaker: 'Lumera-Nurse',
      message: "Coordinating all care elements. Medication schedule optimized around therapy times. Family education materials prepared. Progress monitoring system activated.",
      timestamp: '09:10',
      actions: ['Optimize medication timing', 'Prepare education materials', 'Set up monitoring alerts']
    },
    {
      speaker: 'Lumera-Social',
      message: "Discharge planning initiated. Home safety assessment scheduled. Insurance coverage verified for all recommended therapies and equipment.",
      timestamp: '09:12',
      actions: ['Schedule home assessment', 'Verify insurance coverage', 'Coordinate equipment delivery']
    }
  ],

  outcomes: {
    immediate: [
      'Comprehensive care plan created within 15 minutes',
      'All therapy appointments coordinated without conflicts',
      'Family communication system established',
      'Elder abuse prevention protocols activated',
      'Caregiver stress reduction plan implemented'
    ],
    shortTerm: [
      'Reduced family stress and confusion',
      'Optimized therapy attendance and progress',
      'Prevented medication errors and interactions',
      'Early detection of potential complications',
      'Coordinated discharge planning'
    ],
    longTerm: [
      'Improved stroke recovery outcomes',
      'Prevented secondary health crises',
      'Reduced caregiver burnout',
      'Enhanced family communication',
      'Successful transition to home care'
    ]
  },

  metrics: {
    coordinationTime: 'Reduced from 4+ hours to 15 minutes',
    familyStress: 'Decreased by 70% through clear communication',
    therapyCompliance: 'Increased to 95% through optimized scheduling',
    medicationErrors: 'Reduced to zero through automated checking',
    caregiverBurnout: 'Prevented through proactive support',
    costSavings: '$15,000+ through prevented complications and readmissions'
  },

  realWorldValidation: {
    personalExperience: 'Based on actual family healthcare crisis',
    marketNeed: '795,000 strokes annually in US alone',
    caregiverImpact: '54 million family caregivers need this support',
    costBurden: '$200B lost annually to care coordination failures'
  }
};

module.exports = strokeCareScenario;