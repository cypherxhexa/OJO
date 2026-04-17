import JobForm from "@/components/JobForm";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: parseInt(params.id, 10) }
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/jobs" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
          &larr; Back to Jobs
        </Link>
        <h1 className="font-serif text-3xl mt-4 text-stone-900">Edit Job</h1>
      </div>
      <JobForm initialData={job} />
    </div>
  );
}
