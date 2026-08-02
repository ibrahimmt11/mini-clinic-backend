module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescriptions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      medical_record_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'medical_records', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      medicine_name: { type: Sequelize.STRING, allowNull: false },
      dosage: { type: Sequelize.STRING, allowNull: false },
      instructions: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('prescriptions');
  },
};