const express = require("express");
const router = express.Router();
const controller = require("../controllers/lokasiController");

/**
 * @swagger
 * tags:
 *   - name: Lokasi
 *     description: Manajemen lokasi budidaya
 */

/**
 * @swagger
 * /api/lokasi:
 *   get:
 *     summary: Ambil semua lokasi
 *     tags: [Lokasi]
 *     responses:
 *       200:
 *         description: Daftar lokasi
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-lokasi"
 *                 nama: "Kolam A"
 *                 substrat: "Pasir"
 *                 kedalaman: 2.5
 *                 latitude: -0.925
 *                 longitude: 104.512
 *                 keterangan: "Dekat pematang"
 */
router.get("/", controller.getAllLokasi);

/**
 * @swagger
 * /api/lokasi/{id}:
 *   get:
 *     summary: Ambil lokasi berdasarkan ID
 *     tags: [Lokasi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lokasi ditemukan
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-lokasi"
 *               nama: "Kolam A"
 *               substrat: "Pasir"
 *               kedalaman: 2.5
 *               latitude: -0.925
 *               longitude: 104.512
 *               keterangan: "Dekat pematang"
 *       404:
 *         description: Lokasi tidak ditemukan
 */
router.get("/:id", controller.getLokasiById);

/**
 * @swagger
 * /api/lokasi:
 *   post:
 *     summary: Tambah lokasi baru
 *     tags: [Lokasi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Kolam A"
 *               substrat:
 *                 type: string
 *                 enum: [Pasir, Lumpur Halus, Kerikil dan Batu, Campuran]
 *                 example: "Pasir"
 *               kedalaman:
 *                 type: number
 *                 example: 2.5
 *               latitude:
 *                 type: number
 *                 example: -0.925
 *               longitude:
 *                 type: number
 *                 example: 104.512
 *               keterangan:
 *                 type: string
 *                 example: "Dekat pematang"
 *     responses:
 *       201:
 *         description: Lokasi berhasil ditambahkan
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-baru"
 *               nama: "Kolam A"
 *               substrat: "Pasir"
 *               kedalaman: 2.5
 *               latitude: -0.925
 *               longitude: 104.512
 *               keterangan: "Dekat pematang"
 */
router.post("/", controller.createLokasi);

/**
 * @swagger
 * /api/lokasi/{id}:
 *   put:
 *     summary: Perbarui data lokasi berdasarkan ID
 *     tags: [Lokasi]
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
 *               nama:
 *                 type: string
 *               substrat:
 *                 type: string
 *                 enum: [Pasir, Lumpur Halus, Kerikil dan Batu, Campuran]
 *               kedalaman:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               keterangan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lokasi berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               id: "uuid-lokasi"
 *               nama: "Kolam A"
 *               substrat: "Pasir"
 *               kedalaman: 3.0
 *               latitude: -0.925
 *               longitude: 104.512
 *               keterangan: "Dekat rumah penjaga"
 *       404:
 *         description: Lokasi tidak ditemukan
 */
router.put("/:id", controller.updateLokasi);

/**
 * @swagger
 * /api/lokasi/{id}:
 *   delete:
 *     summary: Hapus lokasi berdasarkan ID
 *     tags: [Lokasi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lokasi berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: Lokasi dihapus
 *       404:
 *         description: Lokasi tidak ditemukan
 */
router.delete("/:id", controller.deleteLokasi);

module.exports = router;
