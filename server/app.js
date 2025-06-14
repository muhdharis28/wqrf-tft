const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const customSwaggerUIOptions = {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info h1 { font-weight: 700; color: #2c3e50; }
      .swagger-ui .info p { font-size: 14px; }
      .swagger-ui .scheme-container { background: #f4f4f4; }
      .swagger-ui .opblock-tag { font-size: 16px; }
    `,
    customSiteTitle: "Dokumentasi API",
};

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, customSwaggerUIOptions));

app.use('/api/kualitas-air', require('./routes/dataKualitasAirRoutes'));
app.use('/api/lokasi', require('./routes/lokasiRoutes'));
app.use('/api/histori-peramalan', require('./routes/historiPeramalanRoutes'));
app.use('/api/peramalan', require('./routes/peramalanRoutes'));

module.exports = app;
