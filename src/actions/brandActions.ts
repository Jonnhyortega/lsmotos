'use server'

import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import { revalidatePath } from "next/cache";
import { normalizeBrandName } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createBrand(formData: FormData) {
  try {
    await dbConnect();

    const rawName = formData.get("name") as string;
    const priority = Number(formData.get("priority") || 0);
    const file = formData.get("logo") as File;

    if (!rawName || !file) {
      throw new Error("Nombre y Logo son obligatorios");
    }

    const name = normalizeBrandName(rawName);

    // Check duplicate
    const existing = await Brand.findOne({ name });
    if (existing) {
        return { success: false, error: "Ya existe una marca con este nombre" };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload Logo
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "lsmotos-brands" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const newBrand = await Brand.create({
      name,
      logoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      priority,
    });

    revalidatePath("/catalogo");
    revalidatePath("/admin/catalogo");

    return { success: true, brand: JSON.parse(JSON.stringify(newBrand)) };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { success: false, error: "Error al crear la marca" };
  }
}

export async function getBrands() {
  await dbConnect();
  // Sort high priority first
  const brands = await Brand.find({}).sort({ priority: -1, name: 1 });
  return JSON.parse(JSON.stringify(brands));
}

export async function deleteBrand(brandId: string) {
    try {
        await dbConnect();
        
        // TODO: Check if products depend on this brand? 
        // For simplicity allow delete but products might be orphaned or we should warn.
        // Or delete products too? Let's just delete the brand for now, user can handle orphans.
        // Actually best practice is to prevent delete if products exist, but user wants speed.
        
        const brand = await Brand.findById(brandId);
        if (!brand) return { success: false, error: "Marca no encontrada" };

        if (brand.publicId) {
            await cloudinary.uploader.destroy(brand.publicId);
        }

        await Brand.findByIdAndDelete(brandId);
        
        revalidatePath("/catalogo");
        revalidatePath("/admin/catalogo");
        
        return { success: true };
    } catch (error) {
        console.error("Error deleting brand:", error);
        return { success: false, error: "Error al eliminar" };
    }
}
