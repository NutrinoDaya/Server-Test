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
exports.connectDB = void 0;
// src/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = 'mongodb://127.0.0.1:27017/Ninja-Legends';
// Change this to your desired Mongo connection string
let isConnected = false;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isConnected) {
            console.log('Already connected to MongoDB.');
            return;
        }
        try {
            yield mongoose_1.default.connect(MONGO_URI, {
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
    });
}
exports.connectDB = connectDB;
