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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/servers.ts
const express_1 = require("express");
const Account_1 = require("../models/Account");
const User_1 = require("../models/User");
const GameServer_1 = require("../models/GameServer");
const router = (0, express_1.Router)();
// GET all servers
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servers = yield GameServer_1.GameServerModel.find({});
        res.json({ success: true, data: servers });
    }
    catch (error) {
        console.error('Error fetching servers:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
// Join server
router.post('/join', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId, serverId } = req.body;
        console.log(`Account ${accountId} joining server ${serverId}`);
        const account = yield Account_1.AccountModel.findById(accountId).populate('users');
        if (!account) {
            return res.status(400).json({ success: false, message: 'Invalid account' });
        }
        const gameServer = yield GameServer_1.GameServerModel.findById(serverId);
        if (!gameServer) {
            return res.status(400).json({ success: false, message: 'Invalid server' });
        }
        // Check if the account already has a user on this server
        let userOnThisServer = yield User_1.UserModel.findOne({
            _id: { $in: account.users },
            server: serverId
        });
        // If no user, create a new one with default stats
        if (!userOnThisServer) {
            userOnThisServer = new User_1.UserModel({
                username: account.name,
                gold: 0,
                coins: 0,
                level: 1,
                server: gameServer._id
            });
            yield userOnThisServer.save();
            // Add this user to the account
            account.users.push(userOnThisServer._id);
            yield account.save();
            // Increment server userCount
            gameServer.userCount += 1;
            yield gameServer.save();
            // Update server status based on userCount
            updateServerStatus(gameServer);
        }
        res.json({
            success: true,
            message: `Joined server ${gameServer.name}`,
            user: userOnThisServer
        });
    }
    catch (error) {
        console.error('Join server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
// Helper to update server status based on userCount
function updateServerStatus(server) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = server.userCount;
        let newStatus = 'available';
        if (count >= 2 && count < 5) {
            newStatus = 'medium';
        }
        else if (count >= 10) {
            newStatus = 'full';
        }
        server.status = newStatus;
        yield server.save();
    });
}
exports.default = router;
