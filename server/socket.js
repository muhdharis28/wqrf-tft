let io = null;

function initSocket(server) {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Client terhubung:", socket.id);
        socket.on("disconnect", () => {
            console.log("🔴 Client keluar:", socket.id);
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io belum diinisialisasi!");
    }
    return io;
}

module.exports = { initSocket, getIO };
