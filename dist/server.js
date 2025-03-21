"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors")); // <-- Import CORS
const database_1 = require("./database");
const auth_1 = __importDefault(require("./routes/auth"));
const servers_1 = __importDefault(require("./routes/servers"));
const GameServer_1 = require("./models/GameServer");
const PORT = 2567;
async function startServer() {
    await (0, database_1.connectDB)();
    const app = (0, express_1.default)();
    // 🛠️ Enable CORS
    app.use((0, cors_1.default)({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization"
    }));
    app.use(body_parser_1.default.json());
    app.use('/auth', auth_1.default);
    app.use('/game', servers_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    await createNewServer();
    setInterval(async () => {
        await createNewServer();
    }, 3600000);
}
async function createNewServer() {
    try {
        const serverName = `Server-${Date.now()}`;
        const newServer = new GameServer_1.GameServerModel({
            name: serverName,
            status: 'available',
            userCount: 0,
            createdAt: new Date()
        });
        await newServer.save();
        console.log(`Created new server: ${serverName}`);
    }
    catch (error) {
        console.error('Error creating new server:', error);
    }
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
