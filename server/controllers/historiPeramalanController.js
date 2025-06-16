const HistoriPeramalan = require('../models/HistoriPeramalan');
const Lokasi = require('../models/Lokasi');

const { getIO } = require('../socket');
const io = getIO();

exports.getAll = async (req, res) => {
    try {
        const lokasiId = req.query.lokasiId;

        const where = {};
        if (lokasiId) {
            where.lokasiId = lokasiId;
        }

        const data = await HistoriPeramalan.findAll({
            where,
            order: [['createdAt', 'DESC']],
            include: {
                model: Lokasi,
                attributes: ['id', 'nama'],
            },
        });

        res.json(data);
    } catch (error) {
        console.error("Error getAll:", error);
        res.status(500).json({ message: 'Gagal mengambil histori peramalan', error });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await HistoriPeramalan.findByPk(req.params.id, {
            include: {
                model: Lokasi,
                attributes: ['id', 'nama'],
            },
        });

        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data', error });
    }
};

exports.create = async (req, res) => {
    try {
        const newData = await HistoriPeramalan.create(req.body);

        const fullData = await HistoriPeramalan.findByPk(newData.id, {
            include: { model: Lokasi, attributes: ['id', 'nama'] }
        });

        io.emit("peramalanBaru", fullData);

        res.status(201).json(newData);
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan data', error });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await HistoriPeramalan.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

        await data.update(req.body);

        const updatedData = await HistoriPeramalan.findByPk(req.params.id, {
            include: { model: Lokasi, attributes: ['id', 'nama'] }
        });

        io.emit("peramalanUpdate", updatedData);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui data', error });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await HistoriPeramalan.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

        await data.destroy();
        res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus data', error });
    }
};
