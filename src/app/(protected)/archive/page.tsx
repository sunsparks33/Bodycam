import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ArchiveTable from "@/components/ArchiveTable";

export default async function ArchivePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null; // Fallback handled by layout redirect
  }

  // Double check authorization on the server side
  if (session.user.role !== "HIGH_COMMAND") {
    redirect("/dashboard");
  }

  // Query ALL clips, including uploader badgeNumber and username, ordered by incidentDate desc
  const clips = await prisma.bodycamClip.findMany({
    include: {
      uploader: {
        select: {
          badgeNumber: true,
          username: true,
        },
      },
    },
    orderBy: {
      incidentDate: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      {/* Top Banner Archive Console */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-blue-200 pb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-[#1a365d] uppercase sm:text-2xl flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <span>LSPD MASTER ARCHIVE</span>
          </h1>
          <p className="text-xs text-blue-500 mt-1 font-mono uppercase tracking-wide">
            High Command Database Access // Security Clearance level: HC-1
          </p>
        </div>
        <div className="flex flex-col bg-white border border-blue-200 rounded-lg px-4 py-2 text-xs font-mono shadow-sm">
          <div className="flex items-center justify-between gap-6 text-slate-500">
            <span>ADMINISTRATOR:</span>
            <span className="text-[#1a365d] font-bold">{session.user.name}</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-slate-500 mt-1">
            <span>CLEARANCE CODE:</span>
            <span className="text-blue-600 font-bold uppercase">HIGH_COMMAND</span>
          </div>
        </div>
      </div>

      {/* Main interactive table view */}
      <ArchiveTable clips={clips} />
    </div>
  );
}
