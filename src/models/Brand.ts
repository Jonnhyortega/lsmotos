import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  logoUrl: string;
  publicId?: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema<IBrand> = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la marca es obligatorio"],
      trim: true,
      unique: true,
    },
    logoUrl: {
      type: String,
      required: [true, "El logo es obligatorio"],
    },
    publicId: {
      type: String,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
