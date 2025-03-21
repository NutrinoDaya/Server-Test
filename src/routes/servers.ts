// src/routes/servers.ts
import { Router } from 'express';
import { AccountModel } from '../models/Account';
import { UserModel } from '../models/User';
import { GameServerModel } from '../models/GameServer';

const router = Router();

// GET all servers
router.get('/list', async (req, res) => {
  try {
    const servers = await GameServerModel.find({});
    res.json({ success: true, data: servers });
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Join server
router.post('/join', async (req, res) => {
  try {
    const { accountId, serverId } = req.body;
    console.log(`Account ${accountId} joining server ${serverId}`);

    const account = await AccountModel.findById(accountId).populate('users');
    if (!account) {
      return res.status(400).json({ success: false, message: 'Invalid account' });
    }

    const gameServer = await GameServerModel.findById(serverId);
    if (!gameServer) {
      return res.status(400).json({ success: false, message: 'Invalid server' });
    }

    // Check if the account already has a user on this server
    let userOnThisServer = await UserModel.findOne({
      _id: { $in: account.users },
      server: serverId
    });

    // If no user, create a new one with default stats
    if (!userOnThisServer) {
      userOnThisServer = new UserModel({
        username: account.name, // or some other naming
        gold: 0,
        coins: 0,
        level: 1,
        server: gameServer._id
      });
      await userOnThisServer.save();

      // Add this user to the account
      account.users.push(userOnThisServer._id);
      await account.save();

      // Increment server userCount
      gameServer.userCount += 1;
      await gameServer.save();

      // Update server status based on userCount
      updateServerStatus(gameServer);
    }

    res.json({
      success: true,
      message: `Joined server ${gameServer.name}`,
      user: userOnThisServer
    });
  } catch (error) {
    console.error('Join server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper to update server status based on userCount
async function updateServerStatus(server: any) {
  const count = server.userCount;
  let newStatus = 'available';
  if (count >= 2 && count < 5) {
    newStatus = 'medium';
  } else if (count >= 10) {
    newStatus = 'full';
  }
  server.status = newStatus;
  await server.save();
}

export default router;
