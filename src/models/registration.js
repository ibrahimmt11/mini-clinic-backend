module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define(
    'Registration',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      patientId: { type: DataTypes.UUID, allowNull: false, field: 'patient_id' },
      doctorId: { type: DataTypes.UUID, allowNull: false, field: 'doctor_id' },
      polyclinicId: { type: DataTypes.UUID, allowNull: false, field: 'polyclinic_id' },
      visitDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'visit_date' },
      paymentType: {
        type: DataTypes.ENUM('Umum', 'BPJS', 'Asuransi'),
        allowNull: false,
        field: 'payment_type',
      },
      initialComplaint: { type: DataTypes.TEXT, allowNull: true, field: 'initial_complaint' },
      status: {
        type: DataTypes.ENUM('Menunggu', 'Check In', 'Pemeriksaan', 'Selesai'),
        allowNull: false,
        defaultValue: 'Menunggu',
      },
    },
    {
      tableName: 'registrations',
      timestamps: true,
    }
  );

  Registration.associate = (models) => {
    Registration.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
    Registration.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    Registration.belongsTo(models.Polyclinic, { foreignKey: 'polyclinicId', as: 'polyclinic' });
    Registration.hasOne(models.Queue, { foreignKey: 'registrationId', as: 'queue' });
  };

  return Registration;
};