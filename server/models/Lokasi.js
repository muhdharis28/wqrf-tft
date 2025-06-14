const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lokasi = sequelize.define('Lokasi', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    substrat: {
        type: DataTypes.ENUM('Pasir', 'Lumpur Halus', 'Kerikil dan Batu', 'Campuran'),
        allowNull: false
    },
    kedalaman: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Lokasi;
