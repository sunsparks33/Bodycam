import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OfficersTable from "@/components/OfficersTable";

export default async function OfficersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null; // Handled by layout / middleware redirects
  }

  // Fetch all registered officer accounts ordered by badgeNumber ascending
  const officers = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      badgeNumber: true,
      role: true,
    },
    orderBy: {
      badgeNumber: "asc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100 uppercase sm:text-2xl flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span>LSPD PERSONNEL DEPT</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wide">
            Internal Agency Roster // Access level: Auth
          </p>
        </div>
        <div className="flex flex-col bg-slate-900 border border-blue-900/30 rounded px-4 py-2 text-xs font-mono shadow-[0_0_10px_rgba(59,130,246,0.05)]">
          <div className="flex items-center justify-between gap-6 text-slate-400">
            <span>OPERATOR:</span>
            <span className="text-slate-100 font-bold">{session.user.name}</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-slate-400 mt-1">
            <span>AUTHORIZATION:</span>
            <span className={`font-bold uppercase ${
              session.user.role === "HIGH_COMMAND" ? "text-cyan-400" : "text-slate-400"
            }`}>
              {session.user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Roster table and registration card */}
      <OfficersTable officers={officers} currentUserRole={session.user.role} />
    </div>
  );
}
