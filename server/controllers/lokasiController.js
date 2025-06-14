const Lokasi = require("../models/Lokasi");

exports.getAllLokasi = async (req, res) => {
    try {
        const lokasi = await Lokasi.findAll();
        res.json(lokasi);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Gagal mengambil data lokasi" });
    }
};

exports.getLokasiById = async (req, res) => {
    try {
        const { id } = req.params;
        const lokasi = await Lokasi.findByPk(id);
        if (!lokasi) {
            return res.status(404).json({ error: "Lokasi tidak ditemukan" });
        }
        res.json(lokasi);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data lokasi berdasarkan ID" });
    }
};

exports.createLokasi = async (req, res) => {
    try {
        const { nama, substrat, kedalaman, latitude, longitude, keterangan } = req.body;
        const newLokasi = await Lokasi.create({ nama, substrat, kedalaman, latitude, longitude, keterangan });
        res.status(201).json(newLokasi);
    } catch (error) {
        res.status(500).json({ error: "Gagal menambahkan lokasi" });
    }
};

exports.updateLokasi = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, substrat, kedalaman, latitude, longitude, keterangan } = req.body;
        const lokasi = await Lokasi.findByPk(id);
        if (!lokasi) return res.status(404).json({ error: "Lokasi tidak ditemukan" });

        lokasi.nama = nama;
        lokasi.substrat = substrat;
        lokasi.kedalaman = kedalaman;
        lokasi.latitude = latitude;
        lokasi.longitude = longitude;
        lokasi.keterangan = keterangan;
        await lokasi.save();

        res.json(lokasi);
    } catch (error) {
        res.status(500).json({ error: "Gagal memperbarui lokasi" });
    }
};

exports.deleteLokasi = async (req, res) => {
    try {
        const { id } = req.params;
        const lokasi = await Lokasi.findByPk(id);
        if (!lokasi) return res.status(404).json({ error: "Lokasi tidak ditemukan" });

        await lokasi.destroy();
        res.json({ message: "Lokasi dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus lokasi" });
    }
};
