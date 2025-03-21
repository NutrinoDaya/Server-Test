"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./database");
const auth_1 = __importDefault(require("./routes/auth"));
const servers_1 = __importDefault(require("./routes/servers"));
const GameServer_1 = require("./models/GameServer");
const PORT = 2567; // The requested port
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect to MongoDB
        yield (0, database_1.connectDB)();
        // Create Express app
        const app = (0, express_1.default)();
        // Middleware
        app.use(body_parser_1.default.json());
        // Routes
        app.use('/auth', auth_1.default);
        app.use('/game', servers_1.default);
        // Start listening
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        // Immediately create an initial server (optional)
        yield createNewServer();
        // Set up an interval to create a new server every hour (3600000 ms)
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield createNewServer();
        }), 3600000);
    });
}
// Create a new server with a timestamped name
function createNewServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serverName = `Server-${Date.now()}`;
            const newServer = new GameServer_1.GameServerModel({
                name: serverName,
                status: 'available',
                userCount: 0,
                createdAt: new Date()
            });
            yield newServer.save();
            console.log(`Created new server: ${serverName}`);
        }
        catch (error) {
            console.error('Error creating new server:', error);
        }
    });
}
startServer().catch((err) => {
    console.error('Failed to start server:', err);
});
