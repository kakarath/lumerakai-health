const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id'
      }
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    participants: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    analysis: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    urgencyLevel: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'low'
    },
    actionItems: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'archived'),
      defaultValue: 'active'
    }
  });

  Conversation.associate = (models) => {
    Conversation.belongsTo(models.Patient, { foreignKey: 'patientId' });
  };

  return Conversation;
};