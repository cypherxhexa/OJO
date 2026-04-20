import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JobGrid } from "@/components/JobGrid";

const CATEGORY_LABELS: Record<string, string> = {
  construction: "Construction",
  healthcare: "Healthcare",
  hospitality: "Hospitality",
  engineering: "Engineering",
  tech: "Tech",
  design: "Design",
  product: "Product",
  marketing: "Marketing",
  sales: "Sales",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  const label = CATEGORY_LABELS[params.name.toLowerCase()] || params.name;

  return {
    title: `${label} Jobs - Overseas Opportunities`,
    description: `Browse curated ${label.toLowerCase()} job opportunities abroad. Find your next international career move.`,
    openGraph: {
      title: `${label} Jobs - Job Opp Jarrar`,
      description: `Browse curated ${label.toLowerCase()} job opportunities abroad.`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { name: string };
}) {
  const label = CATEGORY_LABELS[params.name.toLowerCase()] || params.name;

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-stone-50"></div>}>
        <Header />
      </Suspense>

      <main className="flex-1 flex flex-col">
        <section className="bg-stone-100 border-b border-stone-200 pt-20 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700 mb-3">
              Category
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              {label} Jobs
            </h1>
            <p className="mt-4 text-lg text-stone-600 max-w-xl leading-relaxed">
              Curated {label.toLowerCase()} opportunities from employers worldwide.
            </p>
          </div>
        </section>

        <section className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-amber-700 rounded-full animate-spin"></div>
              </div>
            }
          >
            <JobGrid defaultCategory={label} />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}
