const { spawn } = require("child_process");
const path = require("path");
const Lokasi = require("../models/Lokasi");
const DataKualitasAir = require('../models/DataKualitasAir');
const fetch = require("node-fetch");
const fs = require("fs");

const { getIO } = require('../socket');
const io = getIO();

exports.runForecast = async (req, res) => {
    try {
        const history = req.body;

        if (!Array.isArray(history) || history.length === 0) {
            return res.status(400).json({ error: "Data prediksi (history) harus berupa array dan tidak kosong." });
        }

        const cleanedHistory = history.map((item) => ({
            ...item,
            tanggal: new Date(item.tanggal).toISOString().split("T")[0],
        }));

        const scriptPath = path.join(__dirname, "../../tft/inference.py");
        const venv = path.join(__dirname, "../../tft/venv/Scripts/python.exe");
        const py = spawn(venv, ["-u", scriptPath]);

        let result = "";
        let error = "";

        py.stdin.write(JSON.stringify(cleanedHistory)); // langsung array, bukan object
        py.stdin.end();

        py.stdout.on("data", (data) => {
            result += data.toString();
        });

        py.stderr.on("data", (data) => {
            error += data.toString();
        });

        py.on("close", (code) => {
            console.log("Raw stdout from Python:\n", result);
            console.error("Raw stderr from Python:\n", error);

            const match = result.match(/===BEGIN_RESULT===(.*?)===END_RESULT===/s);
            if (!match) {
                return res.status(500).json({ error: "Gagal mengambil hasil prediksi dari Python.", details: result });
            }

            try {
                const jsonResult = JSON.parse(match[1].trim());
                io.emit("hasilPeramalanBaru", jsonResult);
                res.json(jsonResult);
            } catch (err) {
                console.error("Parsing error:", err);
                res.status(500).json({ error: "Gagal parsing hasil prediksi.", details: result });
            }
        });
    } catch (err) {
        console.error("Backend error:", err);
        res.status(500).json({ error: "Terjadi kesalahan pada server saat memproses prediksi." });
    }
};

const fetchRainfallData = async (latitude, longitude, startDate, endDate) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum&timezone=Asia%2FJakarta`;
    const response = await fetch(url);
    const data = await response.json();
    const rainfallMap = {};

    if (data.daily && data.daily.time && data.daily.precipitation_sum) {
        for (let i = 0; i < data.daily.time.length; i++) {
            rainfallMap[data.daily.time[i]] = data.daily.precipitation_sum[i];
        }
    }

    return rainfallMap;
};

const determineSeason = (month) => {
    if ([12, 1, 2].includes(month)) return "Hujan";
    if ([3, 4, 5].includes(month)) return "Peralihan 1";
    if ([6, 7, 8].includes(month)) return "Kemarau";
    return "Peralihan 2";
};

exports.getDataGenerate = async (req, res) => {
    try {
        const dataKualitasAir = await DataKualitasAir.findAll({
            order: [["lokasiId", "ASC"], ["tanggal", "ASC"]],
        });

        if (!dataKualitasAir.length) {
            return res.status(404).json({ message: "Data kualitas air kosong" });
        }

        const lokasiIds = [...new Set(dataKualitasAir.map((item) => item.lokasiId))];

        const lokasiList = await Lokasi.findAll({
            where: { id: lokasiIds },
        });

        const lokasiMap = {};
        for (const lokasi of lokasiList) {
            lokasiMap[lokasi.id] = lokasi;
        }

        const groupedByLokasi = lokasiIds.map((lokasiId) => {
            const lokasi = lokasiMap[lokasiId];
            const records = dataKualitasAir.filter((item) => item.lokasiId === lokasiId);
            return { lokasi, records };
        });

        const finalData = [];
        for (const group of groupedByLokasi) {
            const { lokasi, records } = group;
            const latitude = lokasi.latitude;
            const longitude = lokasi.longitude;

            const startDate = records[0].tanggal.toISOString().split("T")[0];
            const endDate = records[records.length - 1].tanggal.toISOString().split("T")[0];
            const curahHujanArray = await fetchRainfallData(latitude, longitude, startDate, endDate);
            records.forEach((item, index) => {
                const tanggal = item.tanggal.toISOString().split("T")[0];
                const month = item.tanggal.getMonth() + 1;
                const musim = determineSeason(month);
                const fluktuasi_ph =
                    index === 0 ? 0.0 : Math.abs((item.ph || 0) - (records[index - 1].ph || 0));
                finalData.push({
                    tanggal,
                    kedalaman: lokasi.kedalaman,
                    substrat: lokasi.substrat,
                    ph: item.ph,
                    suhu: item.suhu,
                    kekeruhan: item.kekeruhan,
                    salinitas: item.salinitas,
                    curah_hujan: curahHujanArray[tanggal] || 0.0,
                    bulan: month.toString().padStart(2, "0"),
                    musim,
                    fluktuasi_ph,
                });
            });
        }

        res.json(finalData);
    } catch (error) {
        console.error("Error getDataGenerate:", error);
        res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
};

exports.generateModel = async (req, res) => {
    try {
        // 1. Ambil data dari endpoint getDataGenerate
        const response = await fetch("http://localhost:5000/api/peramalan/data-generate");

        if (!response.ok) {
            throw new Error("Gagal mengambil data dari endpoint /data-generate");
        }

        const jsonData = await response.json();

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return res.status(400).json({ message: "Data kosong dari endpoint." });
        }

        const scriptPath = path.join(__dirname, "../../tft/train.py");
        const venv = path.join(__dirname, "../../tft/venv/Scripts/python.exe");
        const pythonProcess = spawn(venv, ["-u", scriptPath], {
            cwd: __dirname,
        });

        let stdout = "";
        let stderr = "";

        pythonProcess.stdin.write(JSON.stringify(jsonData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                const timestampPath = path.join(__dirname, "../../tft/last_model_timestamp.txt");
                try {
                    fs.writeFileSync(timestampPath, new Date().toISOString(), { flag: "w" });
                } catch (err) {
                    console.error("❌ Gagal menyimpan timestamp:", err);
                }

                console.log("✅ Training berhasil:\n", stdout);

                io.emit("trainingModelSelesai", { timestamp: new Date().toISOString() });

                res.json({ message: "Training berhasil", log: stdout });
            } else {
                console.error("❌ Training gagal:\n", stderr);
                res.status(500).json({ message: "Training gagal", error: stderr });
            }
        });
    } catch (error) {
        console.error("❌ Gagal generate model:", error);
        res.status(500).json({ message: "Gagal generate model", error: error.message });
    }
};

exports.getLastModelTimestamp = (req, res) => {
    const logPath = path.join(__dirname, "../../tft/last_model_timestamp.txt");
    try {
        if (!fs.existsSync(logPath)) {
            return res.status(404).json({ message: "Belum ada model yang digenerate." });
        }

        const timestamp = fs.readFileSync(logPath, "utf-8");
        res.json({ last_trained_at: timestamp });
    } catch (error) {
        console.error("❌ Gagal membaca timestamp:", error);
        res.status(500).json({ message: "Gagal membaca waktu training terakhir." });
    }
};

exports.generateSummary = (req, res) => {
    const data = req.body;

    const formatDate = (tanggal) => {
        const d = new Date(tanggal);
        return d.toISOString().split("T")[0]; // Format jadi YYYY-MM-DD
    };

    let dataString = data
        .map((item) => {
            return `- ${formatDate(item.tanggal)}: WQI ${item.wqi.toFixed(1)}, pH ${item.ph.toFixed(
                1
            )}, Suhu ${item.suhu.toFixed(1)}°C, Salinitas ${item.salinitas.toFixed(
                1
            )} ppt, Kekeruhan ${item.kekeruhan.toFixed(1)} NTU`;
        })
        .join("\n");

    const prompt = `
        Berikut adalah hasil prediksi kualitas air selama ${data.length} hari ke depan:
        ${dataString}
        
        Tulis satu paragraf yang menjelaskan:
        - Kondisi umum kualitas air selama periode tersebut.
        - Tanggal terbaik untuk menebar ikan kerapu cantang.
        - Tanggal yang sebaiknya dihindari karena kualitas air kurang baik.
        - Apakah ada tren penurunan atau peningkatan kualitas air selama beberapa hari terakhir.
        
        Gunakan bahasa Indonesia yang sederhana dan jelas untuk petani tambak. Jangan sertakan format daftar, angka, atau judul seperti "Kualitas Air", cukup tulis langsung satu paragraf narasi yang alami dan mudah dibaca. Hindari gaya tulisan seperti artikel ilmiah atau laporan teknis.
        `.trim();

    const { spawn } = require("child_process");
    const ollama = spawn("ollama", ["run", "gemma:2b"], {
        stdio: ["pipe", "pipe", "inherit"],
    });

    let output = "";
    ollama.stdout.on("data", (data) => {
        output += data.toString();
    });

    ollama.stdin.write(prompt);
    ollama.stdin.end();

    ollama.on("close", () => {
        const trimmed = output.trim();

        io.emit("ringkasanPeramalan", { kesimpulan: trimmed });

        res.json({ kesimpulan: trimmed });
    });
};
