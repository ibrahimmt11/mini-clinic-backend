module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define(
    'Doctor',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      polyclinicId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'polyclinic_id',
      },
    },
    {
      tableName: 'doctors',
      timestamps: true,
    }
  );

  Doctor.associate = (models) => {
    Doctor.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Doctor.belongsTo(models.Polyclinic, { foreignKey: 'polyclinicId', as: 'polyclinic' });
    Doctor.hasMany(models.Registration, { foreignKey: 'doctorId', as: 'registrations' });
  };

  return Doctor;
};