# 🌊 Water Quality Risk Forecasting

Sistem ini dikembangkan untuk memantau dan memprediksi **risiko kualitas air** pada budidaya ikan **Kerapu Cantang** di Kampung Madong, dengan menggabungkan backend API dan model machine learning berbasis **Temporal Fusion Transformer (TFT)**.

---

## 📁 Struktur Proyek

```
project-root/
├── server/     # Backend API dengan ExpressJS
├── tft/        # Inference model TFT (Python)
└── README.md
```

---

## ⚙️ Teknologi

* **Node.js (Express)** – Backend REST API
* **Python + PyTorch Forecasting** – Model TFT untuk prediksi
* **MySQL** – Penyimpanan data kualitas air
* **WhatsApp API & Push Notification** – Sistem peringatan risiko

---

## 🚀 Fitur

* Prediksi parameter kualitas air: suhu, pH, salinitas, kekeruhan
* Perhitungan indeks kualitas air (WQI)
* Pengiriman notifikasi risiko otomatis (WA & app)
* Integrasi data historis dan data IoT eksisting

---

## 🧪 Cara Menjalankan

### 1. Jalankan Backend Express (folder `server/`)

```bash
cd server
npm install
npm run dev
```

### 2. Jalankan Model Inference TFT (folder `tft/`)

```bash
cd tft
python -m venv venv

# Aktifkan virtual environment:
venv\Scripts\activate           # Windows
# atau
source venv/bin/activate        # Linux/Mac

pip install -r requirements.txt
```

---

## 📬 Endpoint API Utama

* `POST /api/peramalan/forecast`
  Kirim data historis kualitas air, sistem akan mengembalikan hasil prediksi risiko.

---

## 📝 Lisensi

MIT License © 2025
