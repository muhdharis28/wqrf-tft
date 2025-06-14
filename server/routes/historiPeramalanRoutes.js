const express = require('express');
const router = express.Router();
const controller = require('../controllers/historiPeramalanController');

/**
 * @swagger
 * tags:
 *   - name: HistoriPeramalan
 *     description: Histori hasil peramalan kualitas air
 */

/**
 * @swagger
 * /api/histori:
 *   get:
 *     summary: Ambil semua histori peramalan
 *     tags: [HistoriPeramalan]
 *     parameters:
 *       - in: query
 *         name: lokasiId
 *         schema:
 *           type: string
 *         description: Filter berdasarkan ID lokasi
 *     responses:
 *       200:
 *         description: Daftar histori peramalan
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-histori"
 *                 tanggalAwal: "2025-06-01"
 *                 tanggalAkhir: "2025-06-14"
 *                 jumlahHari: 14
 *                 dataWQI: { "2025-06-01": 83.2, "2025-06-02": 84.0 }
 *                 dataParameter: { "ph": [7.5, 7.6], "suhu": [30.1, 30.2] }
 *                 lokasiId: "uuid-lokasi"
 *                 Lokasi:
 *                   id: "uuid-lokasi"
 *                   nama: "Kolam A"
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/histori/{id}:
 *   get:
 *     summary: Ambil histori peramalan berdasarkan ID
 *     tags: [HistoriPeramalan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data histori ditemukan
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-histori"
 *               tanggalAwal: "2025-06-01"
 *               tanggalAkhir: "2025-06-14"
 *               jumlahHari: 14
 *               dataWQI: { "2025-06-01": 83.2, "2025-06-02": 84.0 }
 *               dataParameter: { "ph": [7.5, 7.6], "suhu": [30.1, 30.2] }
 *               lokasiId: "uuid-lokasi"
 *               Lokasi:
 *                 id: "uuid-lokasi"
 *                 nama: "Kolam A"
 *       404:
 *         description: Data tidak ditemukan
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/histori:
 *   post:
 *     summary: Tambah histori peramalan
 *     tags: [HistoriPeramalan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tanggalAwal:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               tanggalAkhir:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-14"
 *               jumlahHari:
 *                 type: integer
 *                 example: 14
 *               dataWQI:
 *                 type: object
 *                 example: { "2025-06-01": 83.2, "2025-06-02": 84.0 }
 *               dataParameter:
 *                 type: object
 *                 example: { "suhu": [30.1, 30.2], "ph": [7.5, 7.6] }
 *               lokasiId:
 *                 type: string
 *                 format: uuid
 *                 example: "d4b2f63e-e99f-421a-a6c8-861b537ef456"
 *     responses:
 *       201:
 *         description: Data histori berhasil ditambahkan
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-histori"
 *               tanggalAwal: "2025-06-01"
 *               tanggalAkhir: "2025-06-14"
 *               jumlahHari: 14
 *               dataWQI: { "2025-06-01": 83.2, "2025-06-02": 84.0 }
 *               dataParameter: { "ph": [7.5, 7.6], "suhu": [30.1, 30.2] }
 *               lokasiId: "uuid-lokasi"
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/histori/{id}:
 *   put:
 *     summary: Perbarui histori peramalan
 *     tags: [HistoriPeramalan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tanggalAwal:
 *                 type: string
 *                 format: date
 *               tanggalAkhir:
 *                 type: string
 *                 format: date
 *               jumlahHari:
 *                 type: integer
 *               dataWQI:
 *                 type: object
 *               dataParameter:
 *                 type: object
 *               lokasiId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-histori"
 *               tanggalAwal: "2025-06-01"
 *               tanggalAkhir: "2025-06-14"
 *               jumlahHari: 14
 *               dataWQI: { "2025-06-01": 83.2, "2025-06-02": 84.0 }
 *               dataParameter: { "ph": [7.5, 7.6], "suhu": [30.1, 30.2] }
 *               lokasiId: "uuid-lokasi"
 *       404:
 *         description: Data tidak ditemukan
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/histori/{id}:
 *   delete:
 *     summary: Hapus histori peramalan berdasarkan ID
 *     tags: [HistoriPeramalan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: Data berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 */
router.delete('/:id', controller.remove);

module.exports = router;
