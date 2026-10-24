
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRateLimitHit extends Document {
  key: string;
  createdAt: Date;
}

const RateLimitHitSchema: Schema = new Schema({
  key: { type: String, required: true, index: true },
  // TTL index: MongoDB removes each hit one hour after it was created
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const RateLimitHit: Model<IRateLimitHit> = mongoose.models.RateLimitHit || mongoose.model<IRateLimitHit>('RateLimitHit', RateLimitHitSchema);

export default RateLimitHit;
