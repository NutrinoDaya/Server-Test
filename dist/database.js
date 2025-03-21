"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// src/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = 'mongodb://127.0.0.1:27017/Ninja-Legends';
// Change this to your desired Mongo connection string
let isConnected = false;
async function connectDB() {
    if (isConnected) {
        console.log('Already connected to MongoDB.');
        return;
    }
    try {
        await mongoose_1.default.connect(MONGO_URI, {
        // These options are for older mongoose versions:
        // useNewUrlParser: true, useUnifiedTopology: true
        });
        isConnected = true;
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
exports.connectDB = connectDB;
