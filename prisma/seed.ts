import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.job.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Seed jobs
  await prisma.job.createMany({
    data: [
      {
        title: "Senior Software Engineer",
        company: "TechGlobal Solutions",
        location: "Dubai, UAE",
        category: "Technology",
        type: "Full-time",
        salary: "$5,000 - $8,000/month",
        description:
          "We are looking for an experienced Software Engineer to join our development team in Dubai. You will be responsible for designing, developing, and maintaining scalable web applications. Requirements include 5+ years of experience with TypeScript, React, and Node.js. Competitive salary, housing allowance, and annual flight tickets included.",
        externalUrl: "https://example.com/jobs/senior-software-engineer",
        isActive: true,
        slug: "senior-software-engineer-techglobal-dubai",
      },
      {
        title: "Registered Nurse",
        company: "Al Noor Hospital Group",
        location: "Riyadh, Saudi Arabia",
        category: "Healthcare",
        type: "Full-time",
        salary: "SAR 8,000 - 12,000/month",
        description:
          "Al Noor Hospital Group is hiring Registered Nurses for their Riyadh facilities. Candidates must hold a valid nursing license and have at least 2 years of clinical experience. Benefits include free accommodation, transportation, medical insurance, and 30 days paid leave.",
        externalUrl: "https://example.com/jobs/registered-nurse-riyadh",
        isActive: true,
        slug: "registered-nurse-al-noor-riyadh",
      },
      {
        title: "Construction Site Supervisor",
        company: "BuildRight International",
        location: "Doha, Qatar",
        category: "Construction",
        type: "Contract",
        salary: "QAR 12,000 - 18,000/month",
        description:
          "BuildRight International seeks an experienced Construction Site Supervisor for a major infrastructure project in Doha. The ideal candidate has 7+ years in construction management with expertise in safety compliance and team leadership. 2-year contract with renewal option. Accommodation and meals provided.",
        externalUrl: "https://example.com/jobs/site-supervisor-doha",
        isActive: true,
        slug: "construction-site-supervisor-buildright-doha",
      },
    ],
  });

  // Seed site settings
  await prisma.siteSettings.createMany({
    data: [
      { key: "site_name", value: "JobOpp Jarrar" },
      { key: "site_description", value: "Find overseas job opportunities from trusted sources" },
      { key: "header_ad_code", value: "" },
      { key: "sidebar_ad_code", value: "" },
      { key: "interstitial_ad_code", value: "" },
      { key: "redirect_delay_seconds", value: "5" },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
