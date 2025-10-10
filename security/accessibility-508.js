// Section 508 Accessibility Compliance Utilities

class AccessibilityCompliance {
  static generateAriaLabels(element, context) {
    const labels = {
      'patient-list': 'List of patients, use arrow keys to navigate',
      'conversation-input': 'Enter conversation transcript, required field',
      'ai-analysis': 'AI analysis results, use tab to navigate through findings',
      'urgency-indicator': `Priority level: ${context.urgency}, requires attention`,
      'action-items': 'Action items from conversation analysis'
    };
    
    return labels[element] || 'Interactive element';
  }

  static validateColorContrast(foreground, background) {
    // WCAG AA compliance - 4.5:1 ratio for normal text
    const ratio = this.calculateContrastRatio(foreground, background);
    return ratio >= 4.5;
  }

  static calculateContrastRatio(color1, color2) {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  static getLuminance(color) {
    // Simplified luminance calculation
    const rgb = this.hexToRgb(color);
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;
    
    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static generateKeyboardNavigation() {
    return {
      'Tab': 'Navigate to next interactive element',
      'Shift+Tab': 'Navigate to previous interactive element',
      'Enter/Space': 'Activate button or link',
      'Arrow Keys': 'Navigate within lists or menus',
      'Escape': 'Close modal or cancel action'
    };
  }

  static generateScreenReaderText(data) {
    if (data.type === 'patient') {
      return `Patient: ${data.name}, Date of Birth: ${data.dob}, Medical Record Number: ${data.mrn}`;
    }
    if (data.type === 'conversation') {
      return `Conversation from ${data.date}, Priority: ${data.urgency}, ${data.participants.length} participants`;
    }
    return 'Healthcare data element';
  }
}

module.exports = AccessibilityCompliance;