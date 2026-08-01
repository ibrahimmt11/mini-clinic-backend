module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    'Patient',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      medicalRecordNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'medical_record_number',
      },
      nik: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
        validate: {
          len: [16, 16],
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'birth_date',
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone_number',
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'patients',
      timestamps: true,
    }
  );

  return Patient;
};