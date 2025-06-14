// models/DataKualitasAir.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lokasi = require('./Lokasi');

const DataKualitasAir = sequelize.define('DataKualitasAir', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tanggal: DataTypes.DATE,
    ph: DataTypes.FLOAT,
    suhu: DataTypes.FLOAT,
    kekeruhan: DataTypes.FLOAT,
    salinitas: DataTypes.FLOAT,
});

DataKualitasAir.belongsTo(Lokasi, { foreignKey: 'lokasiId' });
Lokasi.hasMany(DataKualitasAir, { foreignKey: 'lokasiId' });

module.exports = DataKualitasAir;
