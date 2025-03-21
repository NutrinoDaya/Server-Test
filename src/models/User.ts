// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  gold: number;
  coins: number;
  level: number;
  server: mongoose.Types.ObjectId; // reference to GameServer
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  gold: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'GameServer' }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
