const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const poliUmumId = uuidv4();
    const poliGigiId = uuidv4();

    await queryInterface.bulkInsert('polyclinics', [
      { id: poliUmumId, name: 'Poli Umum', createdAt: new Date(), updatedAt: new Date() },
      { id: poliGigiId, name: 'Poli Gigi', createdAt: new Date(), updatedAt: new Date() },
    ]);

    const hashedPassword = await bcrypt.hash('password123', 10);
    const dokterUserId = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: dokterUserId,
        username: 'dokter2',
        password: hashedPassword,
        name: 'Dr. Siti Nurhaliza',
        role: 'Dokter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('doctors', [
      {
        id: uuidv4(),
        user_id: dokterUserId,
        name: 'Dr. Siti Nurhaliza',
        polyclinic_id: poliGigiId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('doctors', null, {});
    await queryInterface.bulkDelete('users', { username: 'dokter2' }, {});
    await queryInterface.bulkDelete('polyclinics', null, {});
  },
};