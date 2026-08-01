module.exports = (sequelize, DataTypes) => {
  const Polyclinic = sequelize.define(
    'Polyclinic',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'polyclinics',
      timestamps: true,
    }
  );

  Polyclinic.associate = (models) => {
    Polyclinic.hasMany(models.Doctor, { foreignKey: 'polyclinicId', as: 'doctors' });
    Polyclinic.hasMany(models.Registration, { foreignKey: 'polyclinicId', as: 'registrations' });
  };

  return Polyclinic;
};