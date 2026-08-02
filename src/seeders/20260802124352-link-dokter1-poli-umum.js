const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    // Ambil id user dokter1 yang sudah ada
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'dokter1' LIMIT 1;`,
    );

    // Ambil id Poli Umum yang sudah ada
    const [polyclinics] = await queryInterface.sequelize.query(
      `SELECT id FROM polyclinics WHERE name = 'Poli Umum' LIMIT 1;`,
    );

    if (users.length === 0 || polyclinics.length === 0) {
      throw new Error(
        "User dokter1 atau Poli Umum tidak ditemukan. Pastikan seeder sebelumnya sudah dijalankan.",
      );
    }

    const dokterUserId = users[0].id;
    const poliUmumId = polyclinics[0].id;

    // Cek apakah dokter1 sudah pernah didaftarkan sebagai doctor (hindari duplikat)
    const [existingDoctor] = await queryInterface.sequelize.query(
      `SELECT id FROM doctors WHERE user_id = '${dokterUserId}' LIMIT 1;`,
    );

    if (existingDoctor.length > 0) {
      console.log("dokter1 sudah terdaftar sebagai doctor, skip.");
      return;
    }

    await queryInterface.bulkInsert("doctors", [
      {
        id: uuidv4(),
        user_id: dokterUserId,
        name: "Dr. Ahmad",
        polyclinic_id: poliUmumId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("doctors", { name: "Dr. Ahmad" }, {});
  },
};
