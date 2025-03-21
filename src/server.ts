import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // <-- Import CORS
import { connectDB } from './database';
import authRoutes from './routes/auth';
import serverRoutes from './routes/servers';
import { GameServerModel } from './models/GameServer';

const PORT = 2567; 

async function startServer() {
  await connectDB();
  const app = express();

  // 🛠️ Enable CORS
  app.use(cors({
      origin: "*", // Allow all origins (Change this in production)
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization"
  }));

  app.use(bodyParser.json());

  app.use('/auth', authRoutes);
  app.use('/game', serverRoutes);

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
    const newServer = new GameServerModel({
      name: serverName,
      status: 'available',
      userCount: 0,
      createdAt: new Date()
    });
    await newServer.save();
    console.log(`Created new server: ${serverName}`);
  } catch (error) {
    console.error('Error creating new server:', error);
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
