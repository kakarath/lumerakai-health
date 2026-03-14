const crypto = require('crypto');

const ALLOWED_PHI_KEYS = new Set(['id', 'name', 'dob', 'medicalHistory', 'insurance', 'demographics', 'conditions', 'medications']);

class HIPAACompliance {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY;
    this.auditLog = [];
  }

  encryptPHI(data) {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'lumerakai-salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted}`;
  }

  decryptPHI(encryptedData) {
    const [ivHex, tagHex, encrypted] = encryptedData.split(':');
    if (!ivHex || !tagHex || !encrypted) throw new Error('HIPAA: Invalid encrypted data format');
    const key = crypto.scryptSync(this.encryptionKey, 'lumerakai-salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
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
    return parsed;
  }

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

  minimizeData(patientData, purpose) {
    const minimumNecessary = {
      treatment: ['id', 'name', 'dob', 'medicalHistory'],
      payment: ['id', 'name', 'insurance'],
      operations: ['id', 'demographics']
    };
    const allowedFields = minimumNecessary[purpose] || [];
    return allowedFields.reduce((obj, key) => {
      if (Object.prototype.hasOwnProperty.call(patientData, key)) obj[key] = patientData[key];
      return obj;
    }, {});
  }

  validateAccess(userId, resource, action) {
    const userRoles = this.getUserRoles(userId);
    const requiredPermission = `${resource}:${action}`;
    const hasAccess = userRoles.some(role => this.rolePermissions[role]?.includes(requiredPermission));
    this.logAccess(userId, action, resource, hasAccess ? 'GRANTED' : 'DENIED');
    return hasAccess;
  }

  getUserRoles(userId) {
    return ['healthcare_provider'];
  }

  get rolePermissions() {
    return {
      healthcare_provider: ['patient:read', 'patient:write', 'conversation:read'],
      patient: ['patient:read_own', 'conversation:read_own'],
      family_member: ['patient:read_limited', 'conversation:read_own']
    };
  }

  getClientIP() { return 'masked_for_demo'; }
  getSessionId() { return crypto.randomBytes(16).toString('hex'); }
}

module.exports = HIPAACompliance;
