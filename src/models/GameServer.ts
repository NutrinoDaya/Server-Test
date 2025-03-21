// src/models/GameServer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGameServer extends Document {
  name: string;
  status: string;  // "available", "medium", or "full"
  userCount: number;
  createdAt: Date;
}

const GameServerSchema = new Schema<IGameServer>({
  name: { type: String, required: true, unique: true },
  status: { type: String, default: 'available' },
  userCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const GameServerModel = mongoose.model<IGameServer>('GameServer', GameServerSchema);
