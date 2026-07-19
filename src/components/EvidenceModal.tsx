"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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

function ModalContent({ clip, onClose }: { clip: Clip; onClose: () => void }) {
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

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex flex-col bg-black/95"
      style={{ zIndex: 99999 }}
    >
      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-b border-cyan-500/30 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full bg-white hover:bg-red-400 cursor-pointer transition-colors shadow-[0_0_4px_rgba(255,255,255,0.4)]"
              onClick={onClose}
            />
            <span className="w-3 h-3 rounded-full bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
            <span className="w-3 h-3 rounded-full bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
          <h3 className="text-[11px] font-bold font-mono tracking-widest text-white uppercase">
            LSPD EVIDENCE PLAYBACK // FILE RECORD
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-white/60 hidden sm:inline">
            FILE: {clip.id.substring(0, 8).toUpperCase()}
          </span>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 focus:outline-none p-1.5 hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Video Player — fills all available space ── */}
      <div className="flex-1 relative bg-black min-h-0">
        {streamableId ? (
          <iframe
            src={`https://streamable.com/e/${streamableId}`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-3">⚠</div>
              <p className="text-red-400 font-mono text-sm tracking-wider">
                [ERROR]: UNABLE TO PARSE VIDEO URL
              </p>
              <p className="text-slate-600 font-mono text-xs mt-2">
                RAW: {clip.streamableUrl}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Info Panel ── */}
      <div className="shrink-0 bg-slate-950 border-t border-cyan-500/30">
        {/* Title Row */}
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 border-b border-slate-800/50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 border border-cyan-900/30 rounded uppercase tracking-wider shrink-0">
              Evidence
            </span>
            {clip.caseNumber && (
              <span className="text-[9px] font-mono text-yellow-400 bg-yellow-950/30 px-2 py-0.5 border border-yellow-900/30 rounded uppercase tracking-wider shrink-0">
                Case #{clip.caseNumber}
              </span>
            )}
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide truncate">
              {clip.title}
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-green-500 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            VERIFIED
          </span>
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-3 divide-x divide-slate-800/50">
          <div className="px-4 sm:px-6 py-2.5">
            <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider">
              Officer
            </span>
            <span className="text-slate-200 text-xs font-semibold">
              {clip.uploader ? clip.uploader.username : "Decommissioned"}
            </span>
            <span className="text-blue-400 font-mono text-[10px] font-bold ml-1.5">
              {clip.uploader ? `#${clip.uploader.badgeNumber}` : ""}
            </span>
          </div>
          <div className="px-4 sm:px-6 py-2.5">
            <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider">
              Incident Date
            </span>
            <span className="text-slate-200 font-mono text-xs font-bold">
              {formatDate(clip.incidentDate)}
            </span>
          </div>
          <div className="px-4 sm:px-6 py-2.5">
            <span className="text-slate-500 block uppercase font-mono text-[8px] tracking-wider">
              Case Number
            </span>
            <span className={`font-mono text-xs font-bold uppercase ${clip.caseNumber ? "text-cyan-400" : "text-slate-600"}`}>
              {clip.caseNumber || "UNASSIGNED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvidenceModal({ clip, onClose }: EvidenceModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!clip || !mounted) return null;

  // Use React Portal to render outside the DOM hierarchy
  // This prevents CSS containing block issues from parents with transforms/filters
  return createPortal(
    <ModalContent clip={clip} onClose={onClose} />,
    document.body
  );
}
