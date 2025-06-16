const DataKualitasAir = require('../models/DataKualitasAir');
const Lokasi = require('../models/Lokasi');
const { Op } = require('sequelize');
const { getIO } = require('../socket');
const io = getIO();

exports.getAll = async (req, res) => {
    try {
        const { limit, sort, lokasiId } = req.query;

        const where = {};
        if (lokasiId) {
            where.lokasiId = lokasiId;
        }

        const options = {
            where,
            include: {
                model: Lokasi,
                attributes: ['id', 'nama'],
            },
        };

        if (limit) {
            options.limit = parseInt(limit);
        }

        if (sort) {
            const sortOrder = sort === "asc" ? "ASC" : "DESC";
            options.order = [["tanggal", sortOrder]];
        }

        const data = await DataKualitasAir.findAll(options);

        res.json(data);
    } catch (error) {
        console.error("Error getAll:", error);
        res.status(500).json({ message: 'Gagal mengambil data', error });
    }
};

exports.getByDateRange = async (req, res) => {
    const { startDate, endDate, lokasiId } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate dan endDate diperlukan sebagai query parameter" });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // tambahkan waktu akhir hari

        const whereClause = {
            tanggal: {
                [Op.between]: [start, end],
            },
        };

        if (lokasiId) {
            whereClause.lokasiId = lokasiId;
        }

        const data = await DataKualitasAir.findAll({
            where: whereClause,
            include: [{ model: Lokasi }],
            order: [["tanggal", "ASC"]],
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data berdasarkan tanggal dan lokasi", error });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await DataKualitasAir.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data', error });
    }
};

exports.create = async (req, res) => {
    try {
        const newData = await DataKualitasAir.create(req.body);

        const fullData = await DataKualitasAir.findByPk(newData.id, {
            include: { model: Lokasi, attributes: ['id', 'nama'] }
        });

        io.emit("dataSensorBaru", fullData);
        res.status(201).json(newData);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan data', error });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await DataKualitasAir.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

        await data.update(req.body);

        const updatedData = await DataKualitasAir.findByPk(req.params.id, {
            include: { model: Lokasi, attributes: ['id', 'nama'] }
        });

        io.emit("dataSensorUpdate", updatedData);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui data', error });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await DataKualitasAir.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

        await data.destroy();
        res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus data', error });
    }
};
