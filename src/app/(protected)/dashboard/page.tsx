import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BodycamForm from "@/components/BodycamForm";

function getStreamableId(url: string): string | null {
  const trimmed = url.trim();
  // If user entered only the 5-10 character video code
  if (/^[a-zA-Z0-9]{5,10}$/.test(trimmed)) {
    return trimmed;
  }
  // If user entered the full URL
  const match = trimmed.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null; // Fallback handled by layout redirect
  }

  // Fetch only this officer's clips, ordered by incidentDate descending
  const clips = await prisma.bodycamClip.findMany({
    where: {
      uploaderId: session.user.id,
    },
    orderBy: {
      incidentDate: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      {/* Top Banner Vibe */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wider text-slate-100 uppercase sm:text-2xl">
            OFFICER ARCHIVE PORTAL
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wide">
            Access Terminal // Logging and Retrieval Console
          </p>
        </div>
        <div className="flex flex-col bg-slate-900 border border-blue-900/20 rounded px-4 py-2 text-xs font-mono">
          <div className="flex items-center justify-between gap-6 text-slate-400">
            <span>OFFICER IN CHARGE:</span>
            <span className="text-slate-100 font-bold">{session.user.name}</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-slate-400 mt-1">
            <span>BADGE ID:</span>
            <span className="text-blue-400 font-bold">#{session.user.badgeNumber}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on left, Grid on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <BodycamForm />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Security & Access Banner */}
          <div className="p-3 bg-slate-900/40 backdrop-blur-md border border-blue-900/30 rounded-lg text-[10px] font-mono text-slate-400 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>PRIVACY CONSOLE: You are strictly viewing your personal bodycam uploads. Global Master Archive is restricted to High Command.</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold font-mono tracking-widest text-slate-200 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>MY PERSONAL BODYCAM EVIDENCE REVIEWS</span>
            </h2>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/50 border border-blue-900/40 px-2.5 py-0.5 rounded font-bold">
              {clips.length} personal clips recorded
            </span>
          </div>

          {clips.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/60 rounded p-12 text-center text-slate-500 font-mono text-xs tracking-wider leading-relaxed">
              NO LOGS DETECTED. PLEASE FILL OUT THE SUBMISSION REPORT FORM ON THE LEFT TO UPLOAD YOUR FIRST BODYCAM CLIP.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clips.map((clip) => {
                const streamableId = getStreamableId(clip.streamableUrl);
                return (
                  <div
                    key={clip.id}
                    className="bg-slate-900 border border-blue-900/10 hover:border-blue-900/25 rounded shadow-lg overflow-hidden flex flex-col transition-all duration-200"
                  >
                    {/* Video player box */}
                    <div className="relative w-full aspect-video bg-slate-950 border-b border-slate-950 flex items-center justify-center">
                      {streamableId ? (
                        <iframe
                          src={`https://streamable.com/e/${streamableId}`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        />
                      ) : (
                        <div className="text-red-400 font-mono text-[10px] p-4 text-center leading-relaxed">
                          [ERROR]: UNABLE TO PARSE VIDEO URL.
                          <br />
                          URL: {clip.streamableUrl}
                        </div>
                      )}
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide line-clamp-1">
                          {clip.title}
                        </h3>

                        {/* Monospace structured info block */}
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/60 text-[9px] text-slate-400 font-mono">
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px] tracking-wider mb-0.5">
                              Incident Date
                            </span>
                            <span className="text-slate-300">
                              {new Date(clip.incidentDate).toLocaleString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase text-[8px] tracking-wider mb-0.5">
                              Case Number
                            </span>
                            <span
                              className={`block ${
                                clip.caseNumber ? "text-cyan-400 font-bold" : "text-slate-500 font-normal"
                              }`}
                            >
                              {clip.caseNumber ? clip.caseNumber.toUpperCase() : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary description section */}
                      <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60 flex-1">
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                          {clip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
