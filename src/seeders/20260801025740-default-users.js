const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'Administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: 'dokter1',
        password: hashedPassword,
        name: 'Dr. Ahmad',
        role: 'Dokter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        username: 'petugas1',
        password: hashedPassword,
        name: 'Siti Petugas',
        role: 'Petugas Pendaftaran',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};