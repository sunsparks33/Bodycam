"use client";

import { useState } from "react";
import EvidenceModal from "./EvidenceModal";

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

interface ArchiveTableProps {
  clips: Clip[];
}

export default function ArchiveTable({ clips }: ArchiveTableProps) {
  const [badgeFilter, setBadgeFilter] = useState("");
  const [caseFilter, setCaseFilter] = useState("");
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  // Filter clips locally by badge number and case number (exact or partial matches)
  const filteredClips = clips.filter((clip) => {
    const badgeTerm = badgeFilter.trim().toLowerCase();
    const caseTerm = caseFilter.trim().toLowerCase();

    const matchesBadge =
      badgeTerm === "" ||
      (clip.uploader
        ? clip.uploader.badgeNumber.toLowerCase().includes(badgeTerm)
        : "decommissioned".includes(badgeTerm));

    const matchesCase =
      caseTerm === "" ||
      (clip.caseNumber && clip.caseNumber.toLowerCase().includes(caseTerm));

    return matchesBadge && matchesCase;
  });

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
    <div className="space-y-6 animate-slideUp">
      {/* Search Console Header */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-lg p-4 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-300 hover:border-blue-500/20">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-[10px] uppercase select-none tracking-wider">Console Filters:</span>
          </div>

          {/* Badge Number Filter */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4 text-blue-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              placeholder="Badge # / decommissioned..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Case Number Filter */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4 text-cyan-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <input
              type="text"
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
              placeholder="Case Number..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider text-right hidden lg:block">
          QUERY ACTIVE // {filteredClips.length} LOGS FILTERED
        </div>
      </div>

      {/* Main Database Table Container */}
      <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-lg shadow-2xl overflow-x-auto relative transition-all duration-300 hover:border-cyan-500/20">
        {/* Top styling indicator line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/80" />

        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-[10px] font-mono text-slate-400 uppercase tracking-widest select-none">
              <th className="py-4 px-6">Incident Date</th>
              <th className="py-4 px-4">Case Number</th>
              <th className="py-4 px-4">Officer Details</th>
              <th className="py-4 px-4">Evidence Title</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredClips.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 font-mono text-xs tracking-wider">
                  NO LOGS FOUND MATCHING SPECIFIED CRITERIA.
                </td>
              </tr>
            ) : (
              filteredClips.map((clip) => (
                <tr
                  key={clip.id}
                  onClick={() => setSelectedClip(clip)}
                  className="hover:bg-slate-850 hover:bg-slate-800/40 transition-colors duration-150 cursor-pointer group"
                >
                  {/* Incident Date */}
                  <td className="py-4 px-6 font-mono text-slate-300 whitespace-nowrap">
                    {formatDate(clip.incidentDate)}
                  </td>
                  {/* Case Number */}
                  <td className="py-4 px-4 font-mono whitespace-nowrap">
                    {clip.caseNumber ? (
                      <span className="text-cyan-400 font-bold uppercase tracking-wider">
                        {clip.caseNumber}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-normal">UNASSIGNED</span>
                    )}
                  </td>
                  {/* Officer details */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-200">
                    {clip.uploader ? (
                      <>
                        <span className="font-mono text-blue-400 font-bold mr-1.5">
                          #{clip.uploader.badgeNumber}
                        </span>
                        <span className="text-slate-400">({clip.uploader.username})</span>
                      </>
                    ) : (
                      <span className="text-red-400/80 font-mono text-[10px] uppercase font-semibold">
                        [DECOMMISSIONED]
                      </span>
                    )}
                  </td>
                  {/* Evidence Title */}
                  <td className="py-4 px-4 text-slate-100 font-bold uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                    {clip.title}
                  </td>
                  {/* Action Button */}
                  <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedClip(clip)}
                      className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-500 active:bg-blue-700 text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded border border-blue-500/40 hover:border-blue-400 shadow transition-all duration-200"
                    >
                      VIEW EVIDENCE
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Evidence Viewer Modal */}
      <EvidenceModal clip={selectedClip} onClose={() => setSelectedClip(null)} />
    </div>
  );
}
