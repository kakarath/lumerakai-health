// Enhanced Stroke Care Coordination Scenario - With Medical Expertise Details
// Patient: 79-year-old mother with right hemisphere ischemic attack

const enhancedStrokeCareScenario = {
  id: 'stroke-care-coordination',
  title: "Stroke Recovery Crisis Prevention",
  description: "79-year-old with right hemisphere ischemic attack, T2D, confabulation, and expert family caregiver",
  participants: ['patient', 'family-caregiver', 'doctor', 'nurse', 'pt', 'ot', 'speech', 'nutritionist', 'social-worker'],
  urgency: 'high',
  complexity: 'maximum',
  
  patientProfile: {
    age: '79 years old',
    condition: 'Right hemisphere ischemic attack',
    symptoms: ['Hemiparesis', 'Confabulation', 'Cognitive changes', 'Left-side hypersensitivity'],
    comorbidities: ['Type 2 Diabetes Mellitus', 'Hypertension', 'Dyslipidemia', 'Metformin therapy'],
    complications: [
      'Elder abuse history', 
      'Confabulation-driven food resistance (craves sweets)',
      'Hypersensitivity requiring massage therapy',
      'Complex medication-nutrition interactions'
    ],
    location: 'International medical evacuation from Nigeria',
    familyCaregiverProfile: {
      background: 'Pre-med/post-bacc certification (Elms College)',
      specialization: 'Lifestyle Medicine & Food as Medicine (American College of Lifestyle Medicine)',
      credits: '5.5 credit certificate',
      expertise: ['T2D nutrition management', 'Therapeutic massage', 'Cognitive stimulation']
    }
  },

  careTeam: {
    'Lumera-Doc': {
      focus: 'Stroke recovery protocols, T2D management, medication optimization',
      alerts: ['Metformin-food interactions', 'Blood glucose fluctuations', 'Recovery milestones']
    },
    'Lumera-Nutrition': {
      focus: 'T2D-friendly meal planning for confabulation patients, Ensure Diabetes supplementation',
      alerts: ['Sugar cravings vs glucose control', 'Protein adequacy', 'Medication timing with meals']
    },
    'Lumera-Therapy': {
      focus: 'Hypersensitivity management, massage therapy coordination, cognitive stimulation',
      alerts: ['Sensory overload', 'Left-side sensitivity changes', 'Engagement and motivation levels']
    },
    'Lumera-Family': {
      focus: 'Expert caregiver support, medical knowledge integration, stress management',
      alerts: ['Caregiver expertise utilization', 'Family dynamics', 'Professional-family coordination']
    },
    'Lumera-Guardian': {
      focus: 'Elder abuse prevention, safety monitoring, advocacy',
      alerts: ['Abuse indicators', 'Neglect signs', 'Unsafe situations']
    }
  },

  conversationFlow: [
    {
      speaker: 'Expert Family Caregiver',
      message: "Mom had a stroke and was evacuated from Nigeria. She has hemiparesis, confabulation, and T2D on Metformin. Her confabulation makes her resist healthy foods and crave sweets. I'm using my pre-med background and Lifestyle Medicine certification to create high-protein, low-sugar meals, but need coordination with her medical team.",
      timestamp: '09:00',
      urgency: 'high',
      expertise: 'Pre-med + Lifestyle Medicine certified'
    },
    {
      speaker: 'Lumera-Doc',
      message: "Stroke with T2D + confabulation noted. Excellent that family caregiver has medical background. Coordinating Metformin timing with meal plans. Reviewing glucose monitoring protocols given cognitive changes.",
      timestamp: '09:02',
      actions: ['Optimize Metformin schedule', 'Coordinate with nutrition expert', 'Set glucose monitoring alerts']
    },
    {
      speaker: 'Lumera-Nutrition',
      message: "Leveraging family caregiver's Lifestyle Medicine expertise. Confabulation + T2D requires specialized approach. Recommending Ensure Diabetes for supplementation. Creating satisfying recipes that control glucose while managing sweet cravings.",
      timestamp: '09:04',
      actions: ['Collaborate with expert caregiver', 'Design confabulation-friendly meal plans', 'Monitor nutritional compliance']
    },
    {
      speaker: 'Lumera-Therapy',
      message: "Left-side hypersensitivity requires gentle massage therapy. Family caregiver already providing therapeutic massage - coordinating with PT/OT. Planning cognitive stimulation activities to maintain engagement and zest for life.",
      timestamp: '09:06',
      actions: ['Coordinate massage therapy schedule', 'Plan cognitive stimulation', 'Monitor sensory improvements']
    },
    {
      speaker: 'Lumera-Family',
      message: "Recognizing expert caregiver's medical background as valuable care team asset. Coordinating professional medical care with family expertise. Providing caregiver support to prevent burnout while utilizing specialized knowledge.",
      timestamp: '09:08',
      actions: ['Integrate family expertise', 'Provide caregiver support', 'Coordinate care responsibilities']
    },
    {
      speaker: 'Lumera-Guardian',
      message: "Elder abuse history documented. Implementing enhanced safety protocols. Ensuring all care providers respect patient dignity and family caregiver expertise. Monitoring for any signs of institutional or family stress.",
      timestamp: '09:10',
      actions: ['Enhanced safety monitoring', 'Respect family expertise', 'Prevent care conflicts']
    }
  ],

  outcomes: {
    immediate: [
      'Expert family caregiver knowledge integrated into care plan',
      'T2D management optimized despite confabulation challenges',
      'Massage therapy coordinated to reduce hypersensitivity',
      'Nutritional strategies designed for cognitive changes',
      'Professional-family care coordination established'
    ],
    shortTerm: [
      'Successful glucose control through expert meal planning',
      'Reduced left-side hypersensitivity through therapeutic massage',
      'Maintained cognitive engagement and motivation',
      'Prevented caregiver burnout through professional support',
      'Eliminated care conflicts between family and professionals'
    ],
    longTerm: [
      'Optimal stroke recovery outcomes through coordinated expertise',
      'Sustained T2D management despite cognitive challenges',
      'Enhanced quality of life through personalized care approach',
      'Family caregiver expertise recognized and supported',
      'Model for expert family caregiver integration'
    ]
  },

  metrics: {
    glucoseControl: 'Maintained HbA1c <7% despite confabulation',
    nutritionCompliance: '90% adherence through expert meal planning',
    sensoryImprovement: '60% reduction in hypersensitivity through massage',
    cognitiveEngagement: 'Sustained motivation and life engagement',
    caregiverBurnout: 'Prevented through professional recognition and support',
    costSavings: '$25,000+ through expert family care coordination'
  },

  realWorldValidation: {
    personalExperience: 'Based on actual family healthcare crisis with medical expertise',
    caregiverCredentials: 'Pre-med + Lifestyle Medicine certification',
    marketNeed: '795,000 strokes annually, many with expert family caregivers',
    expertCaregivers: 'Millions of families have medical backgrounds but lack coordination',
    systemGap: 'Healthcare systems often underutilize family medical expertise'
  },

  demoHighlights: {
    uniqueValue: 'First AI system to recognize and integrate family medical expertise',
    credibility: 'Built by someone who lived the crisis with medical background',
    marketDifferentiation: 'Addresses expert family caregiver coordination gap',
    outcomes: 'Proven results in complex stroke + T2D + confabulation case'
  }
};

module.exports = enhancedStrokeCareScenario;