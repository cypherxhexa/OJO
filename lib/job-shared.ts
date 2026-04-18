export const JOB_CATEGORIES = [
  "Construction",
  "Healthcare",
  "Hospitality",
  "Engineering",
  "Tech",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Other",
] as const;

export const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Freelance",
  "Internship",
] as const;

const CATEGORY_ALIASES = new Map(
  JOB_CATEGORIES.flatMap((category) => [
    [category.toLowerCase(), category],
    [category.replace(/\s+/g, "-").toLowerCase(), category],
  ]),
);

const JOB_TYPE_ALIASES = new Map<string, string>([
  ["full_time", "Full Time"],
  ["full-time", "Full Time"],
  ["full time", "Full Time"],
  ["part_time", "Part Time"],
  ["part-time", "Part Time"],
  ["part time", "Part Time"],
  ["contract", "Contract"],
  ["freelance", "Freelance"],
  ["internship", "Internship"],
]);

export function normalizeCategory(value: string) {
  return CATEGORY_ALIASES.get(value.trim().toLowerCase()) ?? value.trim();
}

export function normalizeJobType(value: string) {
  return JOB_TYPE_ALIASES.get(value.trim().toLowerCase()) ?? value.trim();
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
