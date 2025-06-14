const express = require('express');
const router = express.Router();
const controller = require('../controllers/dataKualitasAirController');

/**
 * @swagger
 * tags:
 *   - name: DataKualitasAir
 *     description: Manajemen data kualitas air
 */

/**
 * @swagger
 * /api/kualitas-air:
 *   get:
 *     summary: Ambil semua data kualitas air
 *     tags: [DataKualitasAir]
 *     responses:
 *       200:
 *         description: Daftar data kualitas air
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-data"
 *                 tanggal: "2025-06-14T07:00:00.000Z"
 *                 ph: 7.8
 *                 suhu: 30.5
 *                 kekeruhan: 2.3
 *                 salinitas: 33.1
 *                 lokasiId: "uuid-lokasi"
 *                 Lokasi:
 *                   id: "uuid-lokasi"
 *                   nama: "Kolam A"
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/kualitas-air/range:
 *   get:
 *     summary: Ambil data berdasarkan rentang tanggal
 *     tags: [DataKualitasAir]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal mulai (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal akhir (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Data dalam rentang waktu
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-data"
 *                 tanggal: "2025-06-14"
 *                 ph: 7.8
 *                 suhu: 30.5
 *                 kekeruhan: 2.3
 *                 salinitas: 33.1
 *                 lokasiId: "uuid-lokasi"
 *                 Lokasi:
 *                   id: "uuid-lokasi"
 *                   nama: "Kolam A"
 */
router.get('/range', controller.getByDateRange);

/**
 * @swagger
 * /api/kualitas-air/{id}:
 *   get:
 *     summary: Ambil data berdasarkan ID
 *     tags: [DataKualitasAir]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data ditemukan
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-data"
 *               tanggal: "2025-06-14T07:00:00.000Z"
 *               ph: 7.8
 *               suhu: 30.5
 *               kekeruhan: 2.3
 *               salinitas: 33.1
 *               lokasiId: "uuid-lokasi"
 *       404:
 *         description: Data tidak ditemukan
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/kualitas-air/{id}:
 *   put:
 *     summary: Perbarui data kualitas air berdasarkan ID
 *     tags: [DataKualitasAir]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID data kualitas air yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tanggal:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-14T07:00:00.000Z"
 *               ph:
 *                 type: number
 *                 example: 7.9
 *               suhu:
 *                 type: number
 *                 example: 31.2
 *               kekeruhan:
 *                 type: number
 *                 example: 3.1
 *               salinitas:
 *                 type: number
 *                 example: 32.8
 *               lokasiId:
 *                 type: string
 *                 format: uuid
 *                 example: "ef39ad26-1f6e-42e6-90ae-8dc934e2e1f7"
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-data"
 *               tanggal: "2025-06-14T07:00:00.000Z"
 *               ph: 7.9
 *               suhu: 31.2
 *               kekeruhan: 3.1
 *               salinitas: 32.8
 *               lokasiId: "uuid-lokasi"
 *       404:
 *         description: Data tidak ditemukan
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/kualitas-air/{id}:
 *   delete:
 *     summary: Hapus data berdasarkan ID
 *     tags: [DataKualitasAir]
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

/**
 * @swagger
 * /api/kualitas-air:
 *   post:
 *     summary: Tambah data kualitas air
 *     tags: [DataKualitasAir]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tanggal:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-14T07:00:00.000Z"
 *               ph:
 *                 type: number
 *                 example: 7.8
 *               suhu:
 *                 type: number
 *                 example: 30.5
 *               kekeruhan:
 *                 type: number
 *                 example: 2.3
 *               salinitas:
 *                 type: number
 *                 example: 33.1
 *               lokasiId:
 *                 type: string
 *                 format: uuid
 *                 example: "ef39ad26-1f6e-42e6-90ae-8dc934e2e1f7"
 *     responses:
 *       201:
 *         description: Data berhasil ditambahkan
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-baru"
 *               tanggal: "2025-06-14T07:00:00.000Z"
 *               ph: 7.8
 *               suhu: 30.5
 *               kekeruhan: 2.3
 *               salinitas: 33.1
 *               lokasiId: "uuid-lokasi"
 */
router.post('/', controller.create);

module.exports = router;
