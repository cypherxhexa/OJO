"use server";

import { prisma } from "@/lib/db";
import { generateUniqueJobSlug, parseJobFormData } from "@/lib/job";
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
    const jobData = parseJobFormData(formData);
    const slug = await generateUniqueJobSlug(jobData.title);

    await prisma.job.create({
      data: { ...jobData, slug },
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Create job error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating job",
    };
  }
}

export async function updateJob(id: number, formData: FormData) {
  try {
    const jobData = parseJobFormData(formData);
    const slug = await generateUniqueJobSlug(jobData.title, id);

    await prisma.job.update({
      where: { id },
      data: { ...jobData, slug },
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update job error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error updating job",
    };
  }
}
