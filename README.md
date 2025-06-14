# Water Quality Risk Forecasting

Sistem ini dikembangkan untuk memantau dan memprediksi **risiko kualitas air** pada budidaya ikan **Kerapu Cantang** di Kampung Madong, dengan menggabungkan backend API dan model machine learning berbasis **Temporal Fusion Transformer (TFT)**.

## 📦 Struktur Proyek
project-root/
├── server/ # Backend API dengan ExpressJS
├── tft/ # Inference model TFT (Python)
└── README.md

## ⚙️ Teknologi
- **Node.js (Express)** – Backend REST API
- **Python + PyTorch Forecasting** – Model TFT untuk prediksi
- **MySQL** – Penyimpanan data kualitas air
- **WhatsApp API & Notifikasi** – Sistem peringatan risiko

## 🚀 Fitur
- Prediksi parameter kualitas air: suhu, pH, salinitas, kekeruhan
- Perhitungan WQI (Water Quality Index)
- Notifikasi risiko ke WhatsApp dan sistem
- Integrasi data IoT dan antarmuka monitoring

## 🧪 Cara Menjalankan

### 1. Backend Express (server/)
```bash
cd server
npm install
npm run dev
```

#### 2. Inference TFT (tft/)
```bash
cd tft
python -m venv venv
venv\Scripts\activate   # Windows
# atau source venv/bin/activate untuk Linux/Mac
pip install -r requirements.txt
```

## 📬 API Utama

- POST /api/peramalan/forecast
Kirim data historis kualitas air, kembalikan hasil prediksi risiko.

## 📝 Lisensi
MIT License © 2025
