module.exports = (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define(
    'MedicalRecord',
    {
      id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
      registrationId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        unique: true, 
        field: 'registration_id' 
    },
      patientId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        field: 'patient_id' 
    },
      doctorId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        field: 'doctor_id' 
    },
      complaint: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
      bloodPressure: { 
        type: DataTypes.STRING, 
        allowNull: true, 
        field: 'blood_pressure' 
    },
      temperature: { 
        type: DataTypes.DECIMAL(4, 1), 
        allowNull: true 
    },
      weight: { 
        type: DataTypes.DECIMAL(5, 2), 
        allowNull: true 
    },
      height: { 
        type: DataTypes.DECIMAL(5, 2), 
        allowNull: true 
    },
      diagnosis: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
      treatmentPlan: { 
        type: DataTypes.TEXT, 
        allowNull: true, 
        field: 'treatment_plan' 
    },
      medicalAction: { 
        type: DataTypes.TEXT, 
        allowNull: true, 
        field: 'medical_action' 
    },
    },
    { tableName: 'medical_records', timestamps: true }
  );

  MedicalRecord.associate = (models) => {
    MedicalRecord.belongsTo(models.Registration, { foreignKey: 'registrationId', as: 'registration' });
    MedicalRecord.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
    MedicalRecord.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    MedicalRecord.hasMany(models.Prescription, { foreignKey: 'medicalRecordId', as: 'prescriptions' });
  };

  return MedicalRecord;
};