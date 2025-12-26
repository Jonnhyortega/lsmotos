
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  city: string;
  phone?: string;
  company?: string;
  message?: string;
  type: 'Distributor' | 'Newsletter';
  createdAt: Date;
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: false, default: '' },
  phone: { type: String, required: false },
  company: { type: String, required: false },
  message: { type: String, required: false },
  type: { 
    type: String, 
    enum: ['Distributor', 'Newsletter'], 
    default: 'Newsletter' 
  },
}, {
  timestamps: true,
});

// Check if the model is already defined to prevent overwriting during hot reloads
const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
