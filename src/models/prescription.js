module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define(
    'Prescription',
    {
      id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
      },
      medicalRecordId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        field: 'medical_record_id' 
      },
      medicineName: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'medicine_name' 
      },
      dosage: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      instructions: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
    },
    { tableName: 'prescriptions', timestamps: true }
  );

  Prescription.associate = (models) => {
    Prescription.belongsTo(models.MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });
  };

  return Prescription;
};