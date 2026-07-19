"use client";

interface Clip {
  id: string;
  title: string;
  streamableUrl: string;
  incidentDate: Date | string;
  caseNumber: string | null;
  description: string;
  uploader: {
    badgeNumber: string;
    username: string;
  } | null;
}

interface EvidenceModalProps {
  clip: Clip | null;
  onClose: () => void;
}

function getStreamableId(url: string): string | null {
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9]{5,10}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export default function EvidenceModal({ clip, onClose }: EvidenceModalProps) {
  if (!clip) return null;

  const streamableId = getStreamableId(clip.streamableUrl);

  const formatDate = (dateInput: Date | string) => {
    return new Date(dateInput).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-12 bg-slate-950/85 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden z-10 animate-zoomIn">
        {/* Modal Window Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-200 uppercase">
              LSPD EVIDENCE PLAYBACK // FILE RECORD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 focus:outline-none p-1 hover:bg-slate-800 rounded transition-colors"
            aria-label="Close Modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          {/* 1. Embedded Video Player */}
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
              <div className="text-red-400 font-mono text-xs p-4 text-center leading-relaxed">
                [ERROR]: UNABLE TO PARSE VIDEO URL.
                <br />
                URL: {clip.streamableUrl}
              </div>
            )}
          </div>

          {/* Details Area */}
          <div className="p-6 space-y-6">
            <div>
              <span className="text-[9px] font-mono text-blue-400 bg-blue-950/50 px-2 py-0.5 border border-blue-900/40 rounded uppercase tracking-wider">
                Evidence Record File
              </span>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide mt-2">
                {clip.title}
              </h3>
            </div>

            {/* 2. Full Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              <div className="bg-slate-950/30 p-3 rounded border border-slate-800/40">
                <span className="text-slate-500 block uppercase text-[8px] tracking-wider mb-1">
                  Reporting Officer
                </span>
                <span className="text-slate-200 block font-sans font-semibold">
                  {clip.uploader ? clip.uploader.username : "Decommissioned Officer"}
                </span>
                <span className="text-blue-400 font-bold block mt-0.5">
                  {clip.uploader ? `Badge #${clip.uploader.badgeNumber}` : "STATUS: REMOVED"}
                </span>
              </div>
              <div className="bg-slate-950/30 p-3 rounded border border-slate-800/40">
                <span className="text-slate-500 block uppercase text-[8px] tracking-wider mb-1">
                  Incident Date
                </span>
                <span className="text-slate-200 font-bold block">
                  {formatDate(clip.incidentDate)}
                </span>
              </div>
              <div className="bg-slate-950/30 p-3 rounded border border-slate-800/40">
                <span className="text-slate-500 block uppercase text-[8px] tracking-wider mb-1">
                  Case Number
                </span>
                <span
                  className={`block font-bold uppercase ${
                    clip.caseNumber ? "text-cyan-400" : "text-slate-500 font-normal"
                  }`}
                >
                  {clip.caseNumber || "UNASSIGNED"}
                </span>
              </div>
            </div>

            {/* 3. Incident Description Summary */}
            <div className="bg-slate-950/60 p-4 rounded border border-slate-800/60">
              <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider mb-2">
                Case Narration Summary
              </span>
              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                {clip.description}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
          <span>FILE_ID: {clip.id.toUpperCase()}</span>
          <span>SYSTEM STATE: SECURITY_CLEARANCE_PASSED</span>
        </div>
      </div>
    </div>
  );
}
