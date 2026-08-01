module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('registrations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      polyclinic_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'polyclinics', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      visit_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.ENUM('Umum', 'BPJS', 'Asuransi'),
        allowNull: false,
      },
      initial_complaint: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Menunggu', 'Check In', 'Pemeriksaan', 'Selesai'),
        allowNull: false,
        defaultValue: 'Menunggu',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('registrations');
  },
};