const { app, server } = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
