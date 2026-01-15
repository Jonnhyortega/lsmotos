'use server'

import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand"; // Ensure Brand model is registered
import { revalidatePath } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createProduct(formData: FormData) {
  try {
    await dbConnect();
    // Ensure Brand model is registered
    const _ = Brand;

    const brandId = formData.get("brandId") as string;
    const modelName = formData.get("model") as string;
    const file = formData.get("image") as File;
    const priority = Number(formData.get("priority") || 0);

    if (!file || !brandId || !modelName) {
      throw new Error("Faltan datos requeridos");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "lsmotos-catalogo" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const newProduct = await Product.create({
      brand: brandId,
      modelName,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      priority,
    } as any);

    revalidatePath("/catalogo");
    revalidatePath("/admin/catalogo");

    return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error al crear el producto" };
  }
}

export async function getProducts() {
  await dbConnect();
  // Ensure Brand model is registered (prevents tree-shaking issues in production)
  const _ = Brand; 
  
  // Populate brand info
  const products = await Product.find({})
    .populate("brand")
    .sort({ priority: -1, modelName: 1 }); // Secondary sort by modelName, primary sort is logic in frontend by brand priority

  return JSON.parse(JSON.stringify(products));
}

export async function updateProduct(formData: FormData) {
    try {
        await dbConnect();
        // Ensure Brand model is registered
        const _ = Brand;
        
        const id = formData.get("id") as string;
        const brandId = formData.get("brandId") as string;
        const modelName = formData.get("model") as string;
        const priority = Number(formData.get("priority") || 0);
        const file = formData.get("image") as File | null;

        if (!id || !brandId || !modelName) {
            throw new Error("Faltan datos requeridos");
        }

        const product = await Product.findById(id);
        if(!product) throw new Error("Producto no encontrado");

        const updateData: any = {
            brand: brandId,
            modelName,
            priority
        };

        // If new file is uploaded
        if (file && file.size > 0) {
            // Delete old image
            if (product.publicId) {
                 await cloudinary.uploader.destroy(product.publicId);
            }

            // Upload new
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                  { folder: "lsmotos-catalogo" },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                ).end(buffer);
            });

            updateData.imageUrl = uploadResult.secure_url;
            updateData.publicId = uploadResult.public_id;
        }

        await Product.findByIdAndUpdate(id, updateData);

        revalidatePath("/catalogo");
        revalidatePath("/admin/catalogo");

        return { success: true };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error al actualizar" };
    }
}

export async function deleteProduct(productId: string) {
    try {
        await dbConnect();
        // Ensure Brand model is registered
        const _ = Brand;
        
        const product = await Product.findById(productId);
        if (!product) return { success: false, error: "Producto no encontrado" };

        if (product.publicId) {
            await cloudinary.uploader.destroy(product.publicId);
        }

        await Product.findByIdAndDelete(productId);
        
        revalidatePath("/catalogo");
        revalidatePath("/admin/catalogo");
        
        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error al eliminar" };
        
    }
}
