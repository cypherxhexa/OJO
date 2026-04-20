import { prisma } from "../lib/db";
import { slugify } from "../lib/utils";

const categories = [
  { name: "Country Guides", slug: "country-guides" },
  { name: "Application Tips", slug: "application-tips" },
  { name: "OFW Advice", slug: "ofw-advice" },
];

const posts = [
  {
    title: "How to Apply for Jobs in Saudi Arabia from the Philippines — Complete 2026 Guide",
    excerpt: "A step-by-step walkthrough of the entire process for Filipino workers seeking employment in Saudi Arabia, from finding legitimate agencies to securing your OEC.",
    category: "Country Guides",
    content: `<h2>Introduction</h2><p>Saudi Arabia remains one of the top destinations for Filipino workers in 2026. With competitive salaries, tax-free income, and thousands of open positions across healthcare, construction, and services, the Kingdom continues to attract OFWs from across the Philippines.</p><h2>Step 1: Find a POEA-Licensed Agency</h2><p>The first and most important step is ensuring you work with a Philippine Overseas Employment Administration (POEA) licensed recruitment agency. Never pay excessive placement fees and always verify the agency's license number on the POEA website.</p><h2>Step 2: Prepare Your Documents</h2><p>You will need a valid passport, NBI clearance, medical certificate from a DOH-accredited clinic, and relevant skills certificates. Some positions may require TESDA certifications.</p><h2>Step 3: Apply and Interview</h2><p>Most agencies post available positions online or at their offices. Submit your resume, attend interviews (often via video call with the Saudi employer), and wait for your job offer.</p><h2>Step 4: Process Your Contract</h2><p>Once you receive a job offer, your contract must be verified by POLO (Philippine Overseas Labor Office) in Saudi Arabia. This ensures your salary, benefits, and working conditions meet minimum standards.</p><h2>Step 5: Attend PDOS</h2><p>Pre-Departure Orientation Seminar is mandatory for all first-time OFWs. This covers your rights, cultural orientation, and emergency procedures.</p><h2>Expected Salaries in 2026</h2><p>Salaries vary by occupation: nurses can expect SAR 5,000-8,000/month, engineers SAR 6,000-12,000/month, and general laborers SAR 1,500-2,500/month.</p>`,
    isPublished: true,
    isFeatured: true,
  },
  {
    title: "Top 10 Countries Hiring OFWs in 2026 — Salaries and Requirements",
    excerpt: "From the Middle East to Europe and Canada, here are the countries with the highest demand for Filipino workers this year, complete with salary ranges and visa requirements.",
    category: "Country Guides",
    content: `<h2>The Global Demand for Filipino Workers</h2><p>Filipino workers are among the most sought-after professionals globally, known for their skills, work ethic, and English proficiency. In 2026, several countries have significantly increased their hiring quotas.</p><h2>1. Saudi Arabia</h2><p>The Kingdom continues to lead with positions in healthcare, construction, and hospitality. Average salary: $500-$2,000/month depending on the role.</p><h2>2. United Arab Emirates</h2><p>Dubai and Abu Dhabi offer opportunities in retail, construction, healthcare, and IT. Average salary: $600-$3,000/month.</p><h2>3. Canada</h2><p>With its Express Entry and Provincial Nominee Programs, Canada actively recruits nurses, IT professionals, and skilled tradespeople. Average salary: CAD 3,000-6,000/month.</p><h2>4. Japan</h2><p>Through the Specified Skilled Worker visa, Japan is hiring in manufacturing, food service, and caregiving. Average salary: ¥180,000-250,000/month.</p><h2>5. Germany</h2><p>Germany's skilled immigration law opens doors for nurses, engineers, and IT specialists. Average salary: €2,500-4,500/month.</p><p>Continue reading for countries 6-10 including Australia, New Zealand, Singapore, Qatar, and South Korea.</p>`,
    isPublished: true,
    isFeatured: false,
  },
  {
    title: "What Documents Do You Need to Work Abroad? Complete Checklist",
    excerpt: "Don't get caught off-guard at the airport. Here is every document you need before leaving for an overseas job — from your passport to your OEC.",
    category: "Application Tips",
    content: `<h2>The Essential Document Checklist</h2><p>Preparing to work abroad requires gathering numerous documents. Missing even one can delay your deployment by weeks. Use this comprehensive checklist to stay organized.</p><h2>Government IDs and Clearances</h2><ul><li>Valid passport (at least 6 months validity)</li><li>NBI Clearance</li><li>PSA Birth Certificate</li><li>Valid government-issued ID</li></ul><h2>Employment Documents</h2><ul><li>Job Offer / Employment Contract (verified by POLO)</li><li>POEA-approved contract</li><li>Overseas Employment Certificate (OEC)</li></ul><h2>Medical Requirements</h2><ul><li>Medical exam from DOH-accredited clinic</li><li>Drug test results</li><li>Vaccination records (including COVID-19 if required)</li></ul><h2>Skills and Education</h2><ul><li>Diploma or transcript of records</li><li>TESDA certificates (if applicable)</li><li>Professional license (for nurses, engineers, etc.)</li><li>Training certificates</li></ul><h2>Travel Documents</h2><ul><li>Work visa (stamped in passport)</li><li>Flight itinerary</li><li>Travel insurance</li><li>PDOS certificate</li></ul>`,
    isPublished: true,
    isFeatured: false,
  },
  {
    title: "How to Spot Fake Overseas Job Offers — Red Flags Every Applicant Should Know",
    excerpt: "Protect yourself from scammers. Learn the telltale signs of fraudulent job offers and illegal recruitment tactics targeting overseas job seekers.",
    category: "OFW Advice",
    content: `<h2>The Growing Problem of Recruitment Fraud</h2><p>Every year, thousands of aspiring overseas workers fall victim to illegal recruiters and fake job offers. These scams can cost you money, time, and even put your safety at risk. Knowing the red flags can save you from becoming the next victim.</p><h2>Red Flag #1: Excessive Placement Fees</h2><p>Legitimate agencies charge regulated fees. If someone is asking for amounts significantly higher than what POEA allows, walk away. The standard placement fee should not exceed one month's salary.</p><h2>Red Flag #2: No POEA License</h2><p>Always verify the recruitment agency's license on the official POEA website. Unlicensed recruiters are operating illegally, and you have no legal protection if something goes wrong.</p><h2>Red Flag #3: "Guaranteed" Job Offers</h2><p>No legitimate agency can guarantee you a job. If someone promises guaranteed placement abroad in exchange for an upfront fee, it is almost certainly a scam.</p><h2>Red Flag #4: Social Media Only Recruitment</h2><p>While social media is a valid marketing tool, legitimate agencies always have physical offices and official websites. Be extremely cautious of "recruiters" who only operate through Facebook or WhatsApp.</p><h2>What to Do If You Encounter a Scam</h2><p>Report suspicious activities to POEA and your local police. Document everything — screenshots, receipts, messages. Your report can help protect other job seekers.</p>`,
    isPublished: true,
    isFeatured: false,
  },
  {
    title: "Canada Jobs for Filipinos 2026 — In-Demand Occupations and How to Apply",
    excerpt: "Canada is actively recruiting Filipino workers across healthcare, IT, and skilled trades. Here is what you need to know about applying and immigrating in 2026.",
    category: "Country Guides",
    content: `<h2>Why Canada?</h2><p>Canada offers one of the best immigration pathways in the world for skilled workers. With a strong economy, excellent healthcare, and a welcoming multicultural society, it is no surprise that Canada is a top destination for Filipino professionals.</p><h2>In-Demand Occupations for 2026</h2><ul><li><strong>Registered Nurses:</strong> Canada faces a critical nursing shortage. Filipino nurses with Canadian credential recognition can earn CAD 65,000-90,000/year.</li><li><strong>IT Professionals:</strong> Software developers, data analysts, and cybersecurity specialists are in high demand. Salaries range from CAD 70,000-120,000/year.</li><li><strong>Skilled Tradespeople:</strong> Electricians, plumbers, and welders are needed across all provinces. Salaries: CAD 50,000-80,000/year.</li><li><strong>Caregivers:</strong> The Home Support Worker Pilot offers a direct pathway to permanent residence.</li></ul><h2>Immigration Pathways</h2><p>The most common pathways include Express Entry (Federal Skilled Worker), Provincial Nominee Programs, and the Atlantic Immigration Program. Each has different requirements for education, work experience, and language proficiency.</p><h2>How to Apply</h2><p>Start by taking an IELTS or CELPIP English test, getting your credentials assessed by WES, and creating an Express Entry profile. The entire process typically takes 6-12 months from application to landing.</p>`,
    isPublished: true,
    isFeatured: false,
  },
];

async function seed() {
  console.log("Seeding blog categories...");
  for (const cat of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }

  console.log("Seeding blog posts...");
  for (const post of posts) {
    const slug = slugify(post.title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          isPublished: post.isPublished,
          isFeatured: post.isFeatured,
          authorName: "Editorial Team",
        },
      });
      console.log(`  Created: ${post.title.slice(0, 60)}...`);
    } else {
      console.log(`  Skipped (exists): ${post.title.slice(0, 60)}...`);
    }
  }

  console.log("✅ Seed complete!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
