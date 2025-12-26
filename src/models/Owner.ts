
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOwner extends Document {
  email: string;
  password: string; // Hashed password
  resetToken?: string;
  resetTokenExpiry?: Date;
  newEmail?: string;
  emailChangeToken?: string;
  emailChangeTokenExpiry?: Date;
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
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiry: {
    type: Date,
    required: false,
  },
  newEmail: {
    type: String,
    required: false,
  },
  emailChangeToken: {
    type: String,
    required: false,
  },
  emailChangeTokenExpiry: {
    type: Date,
    required: false,
  }
}, {
  timestamps: true,
});

// Avoid recompiling the model if it already exists
const Owner: Model<IOwner> = mongoose.models.Owner || mongoose.model<IOwner>('Owner', OwnerSchema);

export default Owner;
