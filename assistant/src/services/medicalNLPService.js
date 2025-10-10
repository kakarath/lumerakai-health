const natural = require('natural');
const compromise = require('compromise');

class MedicalNLPService {
  constructor() {
    this.medicalTerms = [
      'appointment', 'surgery', 'medication', 'prescription', 'diagnosis',
      'symptoms', 'treatment', 'therapy', 'consultation', 'referral',
      'root canal', 'chiropractor', 'dentist', 'physician', 'specialist'
    ];
    
    this.urgencyKeywords = [
      'urgent', 'emergency', 'pain', 'severe', 'critical', 'immediate'
    ];
    
    this.schedulingKeywords = [
      'appointment', 'schedule', 'reschedule', 'cancel', 'book', 'available'
    ];
  }

  analyzeHealthcareConversation(transcript, context = {}) {
    const doc = compromise(transcript);
    
    // Extract medical entities
    const medicalEntities = this.extractMedicalEntities(transcript);
    
    // Detect scheduling conflicts
    const schedulingInfo = this.extractSchedulingInfo(transcript);
    
    // Assess urgency
    const urgencyLevel = this.assessUrgency(transcript);
    
    // Identify participants
    const participants = this.identifyParticipants(transcript, context);
    
    // Extract key points
    const keyPoints = this.extractKeyPoints(transcript);
    
    // Determine if clarification is needed
    const needsClarification = this.needsClarification(transcript, schedulingInfo);

    return {
      medicalEntities,
      schedulingInfo,
      urgencyLevel,
      participants,
      keyPoints,
      needsClarification,
      context: context,
      timestamp: new Date().toISOString()
    };
  }

  extractMedicalEntities(transcript) {
    const entities = [];
    const words = transcript.toLowerCase().split(/\s+/);
    
    this.medicalTerms.forEach(term => {
      if (transcript.toLowerCase().includes(term)) {
        entities.push({
          term,
          type: 'medical',
          confidence: 0.8
        });
      }
    });

    return entities;
  }

  extractSchedulingInfo(transcript) {
    const doc = compromise(transcript);
    
    // Extract dates
    const dates = doc.dates().out('array');
    
    // Extract times
    const times = doc.match('#Time').out('array');
    
    // Look for scheduling conflicts
    const hasConflict = transcript.toLowerCase().includes('conflict') || 
                       transcript.toLowerCase().includes('same day') ||
                       transcript.toLowerCase().includes('reschedule');

    return {
      dates,
      times,
      hasConflict,
      schedulingKeywords: this.schedulingKeywords.filter(keyword => 
        transcript.toLowerCase().includes(keyword)
      )
    };
  }

  assessUrgency(transcript) {
    const urgentWords = this.urgencyKeywords.filter(keyword => 
      transcript.toLowerCase().includes(keyword)
    );
    
    if (urgentWords.length > 2) return 'high';
    if (urgentWords.length > 0) return 'medium';
    return 'low';
  }

  identifyParticipants(transcript, context) {
    const participants = [];
    
    // Common healthcare participant indicators
    const participantIndicators = {
      patient: ['I feel', 'my pain', 'I have', 'I need'],
      family: ['my mom', 'my dad', 'my spouse', 'family member'],
      doctor: ['doctor says', 'physician', 'Dr.', 'medical opinion'],
      nurse: ['nurse', 'nursing'],
      specialist: ['specialist', 'referral to']
    };

    Object.keys(participantIndicators).forEach(role => {
      const indicators = participantIndicators[role];
      if (indicators.some(indicator => transcript.toLowerCase().includes(indicator))) {
        participants.push(role);
      }
    });

    return participants.length > 0 ? participants : ['unknown'];
  }

  extractKeyPoints(transcript) {
    const doc = compromise(transcript);
    
    // Extract sentences with medical or scheduling terms
    const sentences = doc.sentences().out('array');
    const keyPoints = [];
    
    sentences.forEach(sentence => {
      const hasRelevantTerm = this.medicalTerms.some(term => 
        sentence.toLowerCase().includes(term)
      ) || this.schedulingKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      );
      
      if (hasRelevantTerm && sentence.length > 10) {
        keyPoints.push(sentence.trim());
      }
    });

    return keyPoints.slice(0, 5); // Limit to top 5 key points
  }

  needsClarification(transcript, schedulingInfo) {
    // Check for ambiguous scheduling information
    if (schedulingInfo.hasConflict && schedulingInfo.dates.length === 0) {
      return true;
    }
    
    // Check for incomplete medical information
    if (transcript.toLowerCase().includes('pain') && 
        !transcript.toLowerCase().includes('level')) {
      return true;
    }
    
    // Check for transportation issues without solutions
    if (transcript.toLowerCase().includes('no car') || 
        transcript.toLowerCase().includes('transportation')) {
      return true;
    }

    return false;
  }
}

module.exports = MedicalNLPService;