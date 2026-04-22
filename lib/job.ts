import { prisma } from "@/lib/db";
import {
  isValidHttpUrl,
  JOB_CATEGORIES,
  JOB_TYPES,
  normalizeCategory,
  normalizeJobType,
} from "@/lib/job-shared";
import { slugify } from "@/lib/utils";

export type JobInput = {
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string | null;
  description: string;
  externalUrl: string;
  isActive: boolean;
  jobImages: string | null; // JSON array string
};

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseJobFormData(formData: FormData): JobInput {
  return validateJobInput({
    title: readString(formData.get("title")),
    company: readString(formData.get("company")),
    location: readString(formData.get("location")),
    category: readString(formData.get("category")),
    type: readString(formData.get("jobType")),
    salary: readString(formData.get("salary")) || null,
    description: readString(formData.get("description")),
    externalUrl: readString(formData.get("externalUrl")),
    isActive: formData.get("isActive") === "on",
    jobImages: readString(formData.get("jobImages")) || null,
  });
}

export function validateJobInput(input: Partial<JobInput>): JobInput {
  const title = input.title?.trim() ?? "";
  const company = input.company?.trim() ?? "";
  const location = input.location?.trim() ?? "";
  const category = normalizeCategory(input.category ?? "");
  const type = normalizeJobType(input.type ?? "");
  const salary = input.salary?.trim() ? input.salary.trim() : null;
  const description = input.description?.trim() ?? "";
  const externalUrl = input.externalUrl?.trim() ?? "";
  const isActive = Boolean(input.isActive);
  const jobImages = input.jobImages ?? null;

  if (!title || !company || !location || !description || !externalUrl) {
    throw new Error("All required job fields must be provided.");
  }

  if (!JOB_CATEGORIES.includes(category as (typeof JOB_CATEGORIES)[number])) {
    throw new Error("Invalid job category.");
  }

  if (!JOB_TYPES.includes(type as (typeof JOB_TYPES)[number])) {
    throw new Error("Invalid job type.");
  }

  if (!isValidHttpUrl(externalUrl)) {
    throw new Error("External URL must be a valid http or https URL.");
  }

  return {
    title,
    company,
    location,
    category,
    type,
    salary,
    description,
    externalUrl,
    isActive,
    jobImages,
  };
}

export async function generateUniqueJobSlug(title: string, jobId?: number) {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new Error("Unable to generate a slug for this job.");
  }

  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingJob = await prisma.job.findUnique({ where: { slug } });

    if (!existingJob || existingJob.id === jobId) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}
