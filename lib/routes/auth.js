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
// src/routes/auth.ts
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Account_1 = require("../models/Account");
const router = (0, express_1.Router)();
// Registration
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log(`Received registration for account: ${username}`);
        // Check if username exists
        const existing = yield Account_1.AccountModel.findOne({ name: username });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new account
        const newAccount = new Account_1.AccountModel({
            name: username,
            password: hashedPassword,
            users: []
        });
        yield newAccount.save();
        console.log('Registration successful');
        res.json({ success: true, message: 'Registration successful', data: newAccount });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
// Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log(`Received login for: ${username}`);
        const account = yield Account_1.AccountModel.findOne({ name: username });
        if (!account) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, account.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }
        console.log('Login successful');
        res.json({ success: true, message: 'Login successful', data: account });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
exports.default = router;
