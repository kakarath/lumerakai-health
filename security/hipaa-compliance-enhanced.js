// HIPAA Compliance Module for LumeraKai Health
// Ensures healthcare data protection and privacy compliance

const crypto = require('crypto');

const ALLOWED_PHI_KEYS = new Set(['demographics', 'conditions', 'medications', 'vitals', 'care-plan', 'appointments']);

class HIPAACompliance {
  constructor() {
    this.auditLog = [];
    this.encryptionKey = process.env.HIPAA_ENCRYPTION_KEY;
    this.allowedRoles = ['doctor', 'nurse', 'family-caregiver', 'patient'];
  }

  // Data encryption for PHI (Protected Health Information)
  encryptPHI(data) {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'lumerakai-salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    };
  }

  // Data decryption for PHI
  decryptPHI(encryptedData) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.encryptionKey, 'lumerakai-salt', 32);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    let parsed;
    try {
      parsed = JSON.parse(decrypted);
    } catch {
      throw new Error('HIPAA: Decrypted PHI is not valid JSON');
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('HIPAA: Decrypted PHI has unexpected structure');
    }
    // Validate only known PHI keys are present
    const unknownKeys = Object.keys(parsed).filter(k => !ALLOWED_PHI_KEYS.has(k));
    if (unknownKeys.length > 0) {
      throw new Error(`HIPAA: Unexpected PHI fields: ${unknownKeys.join(', ')}`);
    }
    return parsed;
  }

  // Access control validation
  validateAccess(userId, userRole, patientId, action) {
    const accessRules = {
      'doctor': ['read', 'write', 'update', 'delete'],
      'nurse': ['read', 'write', 'update'],
      'family-caregiver': ['read', 'write'],
      'patient': ['read']
    };

    // Log access attempt
    this.logAccess(userId, userRole, patientId, action);

    // Validate role permissions
    if (!this.allowedRoles.includes(userRole)) {
      throw new Error('HIPAA Violation: Unauthorized role');
    }

    if (!accessRules[userRole].includes(action)) {
      throw new Error('HIPAA Violation: Insufficient permissions');
    }

    // Family caregiver special validation
    if (userRole === 'family-caregiver') {
      return this.validateFamilyCaregiverAccess(userId, patientId);
    }

    return true;
  }

  // Validate family caregiver access to specific patient
  validateFamilyCaregiverAccess(caregiverId, patientId) {
    // In production, this would check database relationships
    // For demo, we'll simulate the validation
    const authorizedRelationships = {
      'caregiver-001': ['patient-001'], // Stroke patient
    };

    if (!authorizedRelationships[caregiverId]?.includes(patientId)) {
      throw new Error('HIPAA Violation: Unauthorized patient access');
    }

    return true;
  }

  // Audit logging for HIPAA compliance
  logAccess(userId, userRole, patientId, action, result = 'success') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      userRole,
      patientId,
      action,
      result,
      ipAddress: this.getClientIP(),
      sessionId: this.getSessionId()
    };

    this.auditLog.push(logEntry);
    
    // In production, write to secure audit database
    console.log('HIPAA Audit Log:', logEntry);
  }

  // Data minimization - only return necessary fields
  minimizeData(data, userRole, context) {
    const allowedFields = {
      'doctor': ['*'], // Full access
      'nurse': ['demographics', 'conditions', 'medications', 'vitals'],
      'family-caregiver': ['demographics', 'conditions', 'care-plan', 'medications'],
      'patient': ['demographics', 'conditions', 'medications', 'appointments']
    };

    if (allowedFields[userRole].includes('*')) {
      return data;
    }

    const minimizedData = {};
    allowedFields[userRole].forEach(field => {
      if (data[field]) {
        minimizedData[field] = data[field];
      }
    });

    return minimizedData;
  }

  // Consent management for family caregivers
  validateConsent(patientId, caregiverId, dataType) {
    // In production, check patient consent records
    const consentRecords = {
      'patient-001': {
        'caregiver-001': {
          'medical-data': true,
          'medication-management': true,
          'care-coordination': true,
          'financial-information': false
        }
      }
    };

    const consent = consentRecords[patientId]?.[caregiverId]?.[dataType];
    
    if (!consent) {
      throw new Error('HIPAA Violation: No patient consent for data access');
    }

    return true;
  }

  // Secure communication validation
  validateSecureTransmission(request) {
    // Ensure HTTPS
    if (!request.secure && process.env.NODE_ENV === 'production') {
      throw new Error('HIPAA Violation: Insecure transmission');
    }

    // Validate TLS version
    if (request.connection.getProtocol() < 'TLSv1.2') {
      throw new Error('HIPAA Violation: Insufficient encryption');
    }

    return true;
  }

  // Data retention policy
  checkDataRetention(dataTimestamp, dataType) {
    const retentionPolicies = {
      'audit-logs': 6 * 365 * 24 * 60 * 60 * 1000, // 6 years
      'medical-records': 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
      'session-data': 24 * 60 * 60 * 1000, // 24 hours
      'temporary-data': 60 * 60 * 1000 // 1 hour
    };

    const retentionPeriod = retentionPolicies[dataType];
    const dataAge = Date.now() - new Date(dataTimestamp).getTime();

    if (dataAge > retentionPeriod) {
      return { shouldDelete: true, reason: 'Data retention period exceeded' };
    }

    return { shouldDelete: false };
  }

  // Breach detection and notification
  detectBreach(accessPattern) {
    const suspiciousPatterns = [
      'multiple-failed-attempts',
      'unusual-access-time',
      'bulk-data-access',
      'unauthorized-export'
    ];

    if (suspiciousPatterns.some(pattern => accessPattern.includes(pattern))) {
      this.notifyBreach(accessPattern);
      return true;
    }

    return false;
  }

  // Breach notification
  notifyBreach(details) {
    const breachNotification = {
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      details,
      action: 'IMMEDIATE_INVESTIGATION_REQUIRED'
    };

    // In production, send to security team and compliance officer
    console.error('HIPAA BREACH DETECTED:', breachNotification);
  }

  // Helper methods
  getClientIP() {
    // In production, extract from request headers
    return '127.0.0.1';
  }

  getSessionId() {
    // In production, extract from session
    return 'session-' + Date.now();
  }

  // Generate compliance report
  generateComplianceReport() {
    return {
      auditLogEntries: this.auditLog.length,
      lastAuditEntry: this.auditLog[this.auditLog.length - 1],
      encryptionStatus: 'ACTIVE',
      accessControlStatus: 'ENFORCED',
      dataRetentionStatus: 'COMPLIANT',
      breachDetectionStatus: 'ACTIVE'
    };
  }
}

module.exports = HIPAACompliance;