// src/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { AccountModel } from '../models/Account';

const router = Router();

// Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Received registration for account: ${username}`);

    // Check if username exists
    const existing = await AccountModel.findOne({ name: username });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new account
    const newAccount = new AccountModel({
      name: username,
      password: hashedPassword,
      users: []
    });
    await newAccount.save();

    console.log('Registration successful');
    res.json({ success: true, message: 'Registration successful', data: newAccount });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Received login for: ${username}`);

    const account = await AccountModel.findOne({ name: username });
    if (!account) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    console.log('Login successful');
    res.json({ success: true, message: 'Login successful', data: account });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
