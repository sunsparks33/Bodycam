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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-cyan-500/30 rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.1)] w-full max-w-4xl mx-4 my-4 flex flex-col overflow-hidden z-10 animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Window Title Bar ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-950/90 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="w-px h-4 bg-slate-700 mx-1" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            <h3 className="text-[11px] font-bold font-mono tracking-widest text-slate-300 uppercase">
              LSPD EVIDENCE PLAYBACK // FILE RECORD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-100 focus:outline-none p-1.5 hover:bg-slate-800 rounded-lg transition-all duration-150"
            aria-label="Close Modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Video Player ── */}
        <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
          {streamableId ? (
            <iframe
              src={`https://streamable.com/e/${streamableId}`}
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-3">⚠</div>
                <p className="text-red-400 font-mono text-xs tracking-wider">
                  [ERROR]: UNABLE TO PARSE VIDEO URL
                </p>
                <p className="text-slate-600 font-mono text-[10px] mt-1">
                  RAW: {clip.streamableUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Evidence Info Bar ── */}
        <div className="px-5 py-4 border-t border-slate-800/60 bg-slate-950/60">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-900/30 rounded uppercase tracking-wider shrink-0">
                  Evidence File
                </span>
                {clip.caseNumber && (
                  <span className="text-[9px] font-mono text-yellow-400 bg-yellow-950/30 px-2 py-0.5 border border-yellow-900/30 rounded uppercase tracking-wider shrink-0">
                    Case #{clip.caseNumber}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide truncate">
                {clip.title}
              </h3>
            </div>
          </div>
        </div>

        {/* ── Metadata Grid ── */}
        <div className="grid grid-cols-3 border-t border-slate-800/40">
          <div className="px-5 py-3 border-r border-slate-800/40">
            <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider mb-1">
              Reporting Officer
            </span>
            <span className="text-slate-200 block font-semibold text-xs">
              {clip.uploader ? clip.uploader.username : "Decommissioned Officer"}
            </span>
            <span className="text-blue-400 font-mono text-[10px] font-bold block mt-0.5">
              {clip.uploader ? `Badge #${clip.uploader.badgeNumber}` : "STATUS: REMOVED"}
            </span>
          </div>
          <div className="px-5 py-3 border-r border-slate-800/40">
            <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider mb-1">
              Incident Date
            </span>
            <span className="text-slate-200 font-mono text-xs font-bold block">
              {formatDate(clip.incidentDate)}
            </span>
          </div>
          <div className="px-5 py-3">
            <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider mb-1">
              Case Number
            </span>
            <span
              className={`block font-mono text-xs font-bold uppercase ${
                clip.caseNumber ? "text-cyan-400" : "text-slate-600"
              }`}
            >
              {clip.caseNumber || "UNASSIGNED"}
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="px-5 py-4 border-t border-slate-800/40 bg-slate-950/40">
          <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider mb-2">
            Case Narration Summary
          </span>
          <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
            {clip.description}
          </p>
        </div>

        {/* ── Footer Status Bar ── */}
        <div className="px-5 py-2.5 border-t border-slate-800/60 bg-slate-950/70 flex items-center justify-between text-[9px] text-slate-600 font-mono select-none">
          <span>FILE_ID: {clip.id.substring(0, 8).toUpperCase()}…</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
            CLEARANCE: VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
}
