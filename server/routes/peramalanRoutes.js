const express = require("express");
const router = express.Router();
const controller = require("../controllers/peramalanController");

/**
 * @swagger
 * tags:
 *   - name: Peramalan
 *     description: Proses prediksi dan pelatihan model kualitas air
 */

/**
 * @swagger
 * /api/peramalan:
 *   post:
 *     summary: Jalankan prediksi menggunakan model TFT
 *     tags: [Peramalan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 tanggal:
 *                   type: string
 *                   format: date
 *                 ph:
 *                   type: number
 *                 suhu:
 *                   type: number
 *                 kekeruhan:
 *                   type: number
 *                 salinitas:
 *                   type: number
 *                 kedalaman:
 *                   type: number
 *                 substrat:
 *                   type: string
 *                 curah_hujan:
 *                   type: number
 *                 bulan:
 *                   type: string
 *                 musim:
 *                   type: string
 *                 fluktuasi_ph:
 *                   type: number
 *     responses:
 *       200:
 *         description: Hasil prediksi dikembalikan
 *         content:
 *           application/json:
 *             example:
 *               - tanggal: "2025-06-15"
 *                 ph: 7.6
 *                 suhu: 30.5
 *                 salinitas: 32.1
 *                 kekeruhan: 2.8
 *                 wqi: 82.5
 */
router.post("/", controller.runForecast);

/**
 * @swagger
 * /api/peramalan/data-generate:
 *   get:
 *     summary: Ambil data kualitas air untuk pelatihan model
 *     tags: [Peramalan]
 *     responses:
 *       200:
 *         description: Data siap digunakan untuk training model
 *         content:
 *           application/json:
 *             example:
 *               - tanggal: "2025-06-01"
 *                 ph: 7.8
 *                 suhu: 30.2
 *                 kekeruhan: 2.5
 *                 salinitas: 33.0
 *                 kedalaman: 2.5
 *                 substrat: "Pasir"
 *                 curah_hujan: 4.2
 *                 bulan: "06"
 *                 musim: "Kemarau"
 *                 fluktuasi_ph: 0.1
 */
router.get("/data-generate", controller.getDataGenerate);

/**
 * @swagger
 * /api/peramalan/generate-model:
 *   post:
 *     summary: Latih model TFT menggunakan data yang ada
 *     tags: [Peramalan]
 *     responses:
 *       200:
 *         description: Training berhasil
 *         content:
 *           application/json:
 *             example:
 *               message: "Training berhasil"
 *               log: "Epoch 1/10..."
 *       500:
 *         description: Training gagal
 *         content:
 *           application/json:
 *             example:
 *               message: "Training gagal"
 *               error: "Error: invalid input"
 */
router.post("/generate-model", controller.generateModel);

/**
 * @swagger
 * /api/peramalan/last-trained:
 *   get:
 *     summary: Ambil timestamp terakhir kali model dilatih
 *     tags: [Peramalan]
 *     responses:
 *       200:
 *         description: Tanggal terakhir pelatihan dikembalikan
 *         content:
 *           application/json:
 *             example:
 *               last_trained_at: "2025-06-14T08:20:45.000Z"
 *       404:
 *         description: Belum ada model yang dilatih
 *         content:
 *           application/json:
 *             example:
 *               message: "Belum ada model yang digenerate."
 */
router.get("/last-trained", controller.getLastModelTimestamp);

/**
 * @swagger
 * /api/peramalan/ai-summary:
 *   post:
 *     summary: Hasilkan kesimpulan prediksi berbasis AI
 *     tags: [Peramalan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 tanggal:
 *                   type: string
 *                   format: date
 *                 wqi:
 *                   type: number
 *                 ph:
 *                   type: number
 *                 suhu:
 *                   type: number
 *                 salinitas:
 *                   type: number
 *                 kekeruhan:
 *                   type: number
 *     responses:
 *       200:
 *         description: Ringkasan AI berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               kesimpulan: "Selama periode ini, kualitas air cenderung stabil..."
 */
router.post("/ai-summary", controller.generateSummary);

module.exports = router;
