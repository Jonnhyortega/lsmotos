import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  brand: mongoose.Schema.Types.ObjectId; // Reference to Brand
  modelName: string;
  imageUrl: string;
  publicId?: string;
  priority: number; // Priority within the brand models (optional, user didn't specify strict ordering inside brand but good to keep)
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "La marca es obligatoria"],
    },
    modelName: {
      type: String,
      required: [true, "El modelo es obligatorio"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "La imagen es obligatoria"],
    },
    publicId: {
      type: String,
    },
    priority: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
