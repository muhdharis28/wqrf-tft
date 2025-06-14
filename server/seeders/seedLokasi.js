const sequelize = require("../config/database");
const Lokasi = require("../models/Lokasi")

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection established.");
        await Lokasi.sync({ force: true });

        const seedData = [
            { nama: "Tambak 1", koordinat: "-7.01, 112.01", keterangan: "Lokasi tambak nomor 1" },
            { nama: "Tambak 2", koordinat: "-7.02, 112.02", keterangan: "Lokasi tambak nomor 2" },
            { nama: "Tambak 3", koordinat: "-7.03, 112.03", keterangan: "Lokasi tambak nomor 3" },
            { nama: "Tambak 4", koordinat: "-7.04, 112.04", keterangan: "Lokasi tambak nomor 4" },
            { nama: "Tambak 5", koordinat: "-7.05, 112.05", keterangan: "Lokasi tambak nomor 5" },
        ];

        await Lokasi.bulkCreate(seedData);
        console.log("Seed data for Lokasi inserted.");
    } catch (error) {
        console.error("Seeding Lokasi failed:", error);
    } finally {
        await sequelize.close();
    }
};

seed();
