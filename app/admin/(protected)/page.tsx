import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const totalJobs = await prisma.job.count();
  const activeJobs = await prisma.job.count({ where: { isActive: true } });
  const inactiveJobs = await prisma.job.count({ where: { isActive: false } });
  
  const aggregateClicks = await prisma.job.aggregate({
    _sum: {
      clicks: true
    }
  });
  const totalClicks = aggregateClicks._sum.clicks || 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-4xl mb-2 text-stone-900">Overview</h1>
      <p className="text-stone-500 mb-8 font-sans">Welcome to your admin dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h2 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Total Jobs</h2>
          <p className="font-serif text-3xl text-stone-900">{totalJobs}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h2 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Active Jobs</h2>
          <p className="font-serif text-3xl text-green-600">{activeJobs}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h2 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Inactive Jobs</h2>
          <p className="font-serif text-3xl text-stone-400">{inactiveJobs}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h2 className="text-stone-500 text-sm uppercase tracking-wider mb-2">Total Clicks</h2>
          <p className="font-serif text-3xl text-amber-600">{totalClicks}</p>
        </div>
      </div>
    </div>
  );
}
