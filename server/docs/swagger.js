const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const PORT = process.env.PORT || 5000;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Kualitas Air Budidaya",
            version: "1.0.0",
            description: "Dokumentasi API untuk sistem monitoring dan peramalan kualitas air",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [path.join(__dirname, "../routes/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
