import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteJob } from "@/app/actions/adminJobs";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-stone-900">Manage Jobs</h1>
          <p className="text-stone-500 font-sans">View, edit, and delete job listings.</p>
        </div>
        <Link 
          href="/admin/jobs/new"
          className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 font-sans rounded transition-colors"
        >
          + Add New Job
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden font-sans">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm tracking-wide">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium hidden md:table-cell">Company</th>
              <th className="p-4 font-medium hidden md:table-cell">Category</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Clicks</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-stone-900">{job.title}</p>
                    <p className="text-xs text-stone-500 md:hidden">{job.company}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell text-stone-600">{job.company}</td>
                  <td className="p-4 hidden md:table-cell text-stone-600">
                    <span className="bg-stone-100 px-2 py-1 rounded text-xs">{job.category}</span>
                  </td>
                  <td className="p-4">
                    {job.isActive ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-semibold">Active</span>
                    ) : (
                      <span className="text-stone-500 bg-stone-100 px-2 py-1 rounded text-xs font-semibold">Inactive</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-medium text-stone-700">{job.clicks}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <Link 
                        href={`/admin/jobs/${job.id}/edit`} 
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <form action={deleteJob.bind(null, job.id)}>
                        <button 
                          type="submit" 
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
