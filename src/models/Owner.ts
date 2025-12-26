
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOwner extends Document {
  email: string;
  password: string; // Hashed password
  createdAt: Date;
  updatedAt: Date;
}

const OwnerSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    trim: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
}, {
  timestamps: true,
});

// Avoid recompiling the model if it already exists
const Owner: Model<IOwner> = mongoose.models.Owner || mongoose.model<IOwner>('Owner', OwnerSchema);

export default Owner;
