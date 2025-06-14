// seeders/seed.js
const sequelize = require('../config/database');
const DataKualitasAir = require('../models/DataKualitasAir');
const Lokasi = require('../models/Lokasi');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        await sequelize.sync({ force: true });

        const lokasiMadong = await Lokasi.create({ nama: 'Kampung Madong' });

        const seedData = [
            {
                tanggal: new Date(),
                ph: 7.2,
                suhu: 28.5,
                kekeruhan: 5.3,
                salinitas: 30.1,
                lokasiId: lokasiMadong.id,
            },
            {
                tanggal: new Date(),
                ph: 6.8,
                suhu: 29.0,
                kekeruhan: 6.1,
                salinitas: 29.7,
                lokasiId: lokasiMadong.id,
            },
        ];

        await DataKualitasAir.bulkCreate(seedData);
        console.log('Seed data inserted.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seed();
