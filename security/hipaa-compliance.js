const crypto = require('crypto');

class HIPAACompliance {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY;
    this.auditLog = [];
  }

  // PHI Encryption
  encryptPHI(data) {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptPHI(encryptedData) {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  // Audit Logging
  logAccess(userId, action, resource, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      result,
      ipAddress: this.getClientIP(),
      sessionId: this.getSessionId()
    };
    
    this.auditLog.push(logEntry);
    console.log('HIPAA Audit:', logEntry);
  }

  // Data Minimization
  minimizeData(patientData, purpose) {
    const minimumNecessary = {
      'treatment': ['id', 'name', 'dob', 'medicalHistory'],
      'payment': ['id', 'name', 'insurance'],
      'operations': ['id', 'demographics']
    };

    const allowedFields = minimumNecessary[purpose] || [];
    return Object.keys(patientData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = patientData[key];
        return obj;
      }, {});
  }

  // Access Control
  validateAccess(userId, resource, action) {
    const userRoles = this.getUserRoles(userId);
    const requiredPermission = `${resource}:${action}`;
    
    const hasAccess = userRoles.some(role => 
      this.rolePermissions[role]?.includes(requiredPermission)
    );

    this.logAccess(userId, action, resource, hasAccess ? 'GRANTED' : 'DENIED');
    return hasAccess;
  }

  getUserRoles(userId) {
    return ['healthcare_provider'];
  }

  get rolePermissions() {
    return {
      'healthcare_provider': ['patient:read', 'patient:write', 'conversation:read'],
      'patient': ['patient:read_own', 'conversation:read_own'],
      'family_member': ['patient:read_limited', 'conversation:read_own']
    };
  }

  getClientIP() {
    return 'masked_for_demo';
  }

  getSessionId() {
    return crypto.randomBytes(16).toString('hex');
  }
}

module.exports = HIPAACompliance;