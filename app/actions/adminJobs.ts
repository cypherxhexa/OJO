"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteJob(id: number) {
  try {
    await prisma.job.delete({
      where: { id },
    });
    revalidatePath("/admin/jobs");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete job:", error);
  }
}

export async function createJob(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    
    await prisma.job.create({
      data: {
        title,
        company: formData.get("company") as string,
        location: formData.get("location") as string,
        salary: formData.get("salary") as string || null,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        type: formData.get("jobType") as string,
        externalUrl: formData.get("externalUrl") as string,
        isActive: formData.get("isActive") === "on",
        slug,
      }
    });
    
    revalidatePath("/admin/jobs");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Create job error:", error);
    return { success: false, error: "Error creating job" };
  }
}

export async function updateJob(id: number, formData: FormData) {
  try {
    await prisma.job.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        company: formData.get("company") as string,
        location: formData.get("location") as string,
        salary: formData.get("salary") as string || null,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        type: formData.get("jobType") as string,
        externalUrl: formData.get("externalUrl") as string,
        isActive: formData.get("isActive") === "on",
      }
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update job error:", error);
    return { success: false, error: "Error updating job" };
  }
}
