module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define(
    'Queue',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      registrationId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'registration_id',
      },
      queueNumber: { type: DataTypes.STRING(10), allowNull: false, field: 'queue_number' },
      queueDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'queue_date' },
      status: {
        type: DataTypes.ENUM('Menunggu', 'Dipanggil', 'Selesai', 'Dilewati'),
        allowNull: false,
        defaultValue: 'Menunggu',
      },
      calledAt: { type: DataTypes.DATE, allowNull: true, field: 'called_at' },
    },
    {
      tableName: 'queues',
      timestamps: true,
    }
  );

  Queue.associate = (models) => {
    Queue.belongsTo(models.Registration, { foreignKey: 'registrationId', as: 'registration' });
  };

  return Queue;
};