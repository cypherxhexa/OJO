import JobForm from "@/components/JobForm";
import Link from "next/link";

export default function NewJobPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/jobs" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
          &larr; Back to Jobs
        </Link>
        <h1 className="font-serif text-3xl mt-4 text-stone-900">Create New Job</h1>
      </div>
      <JobForm />
    </div>
  );
}
