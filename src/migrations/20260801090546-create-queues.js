module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('queues', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      registration_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'registrations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      queue_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      queue_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Menunggu', 'Dipanggil', 'Selesai', 'Dilewati'),
        allowNull: false,
        defaultValue: 'Menunggu',
      },
      called_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('queues');
  },
};