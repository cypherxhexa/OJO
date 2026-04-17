import { Job } from "@prisma/client";

interface JobPostingJsonLdProps {
  job: Job;
  url: string;
}

export function JobPostingJsonLd({ job, url }: JobPostingJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    employmentType: mapEmploymentType(job.type),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    url: url,
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: {
          "@type": "QuantitativeValue",
          value: job.salary,
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function mapEmploymentType(type: string): string {
  const mapping: Record<string, string> = {
    FULL_TIME: "FULL_TIME",
    "Full-time": "FULL_TIME",
    "Full Time": "FULL_TIME",
    PART_TIME: "PART_TIME",
    "Part-time": "PART_TIME",
    "Part Time": "PART_TIME",
    CONTRACT: "CONTRACTOR",
    Contract: "CONTRACTOR",
    FREELANCE: "CONTRACTOR",
    Freelance: "CONTRACTOR",
    INTERNSHIP: "INTERN",
    Internship: "INTERN",
  };
  return mapping[type] || "OTHER";
}
