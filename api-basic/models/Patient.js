const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fhirId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'unknown'),
      allowNull: false
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.JSON,
    emergencyContact: DataTypes.JSON,
    medicalRecordNumber: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  Patient.associate = (models) => {
    Patient.hasMany(models.Conversation, { foreignKey: 'patientId' });
    Patient.hasMany(models.CareEvent, { foreignKey: 'patientId' });
  };

  return Patient;
};