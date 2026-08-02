module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medical_records', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      registration_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'registrations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      patient_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'patients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      doctor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'doctors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      // Subjective
      complaint: { type: Sequelize.TEXT, allowNull: true },
      // Objective
      blood_pressure: { type: Sequelize.STRING, allowNull: true },
      temperature: { type: Sequelize.DECIMAL(4, 1), allowNull: true },
      weight: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
      height: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
      // Assessment
      diagnosis: { type: Sequelize.TEXT, allowNull: true },
      // Plan
      treatment_plan: { type: Sequelize.TEXT, allowNull: true },
      medical_action: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('medical_records');
  },
};