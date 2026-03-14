module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // New feature
      'fix',      // Bug fix
      'docs',     // Documentation
      'style',    // Formatting, no code change
      'refactor', // Code refactor
      'test',     // Tests
      'chore',    // Build process, tooling
      'perf',     // Performance improvement
      'ci',       // CI/CD changes
      'security', // Security fixes (HIPAA compliance)
      'fhir',     // FHIR integration changes
      'hipaa'     // HIPAA compliance changes
    ]],
    'subject-max-length': [2, 'always', 100]
  }
};