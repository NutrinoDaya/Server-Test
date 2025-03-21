// src/models/Account.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  password: string;
  users: mongoose.Types.ObjectId[]; // references to User documents
}

const AccountSchema = new Schema<IAccount>({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);
