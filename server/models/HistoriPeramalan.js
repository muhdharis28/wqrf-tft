const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lokasi = require('./Lokasi');

const HistoriPeramalan = sequelize.define('HistoriPeramalan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tanggalAwal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    tanggalAkhir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    jumlahHari: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dataWQI: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    dataParameter: {
        type: DataTypes.JSON,
        allowNull: true,
    }
});

HistoriPeramalan.belongsTo(Lokasi, { foreignKey: 'lokasiId' });
Lokasi.hasMany(HistoriPeramalan, { foreignKey: 'lokasiId' });

module.exports = HistoriPeramalan;
