"use client";

import { useState } from "react";
import { submitBodycamClip } from "@/app/actions/bodycam";

export default function BodycamForm() {
  const [title, setTitle] = useState("");
  const [streamableUrl, setStreamableUrl] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await submitBodycamClip({
        title,
        streamableUrl,
        incidentDate,
        caseNumber: caseNumber || undefined,
        description,
      });

      if (response.success) {
        setSuccessMessage("SUBMISSION LOGGED: Clip archived successfully.");
        setTitle("");
        setStreamableUrl("");
        setIncidentDate("");
        setCaseNumber("");
        setDescription("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "SUBMISSION FAILED: Database insertion rejected.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-blue-400/60 hover:shadow-md">
      {/* Blue accent strip */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-600" />

      <div className="mb-6 flex items-center justify-between border-b border-blue-100 pb-3">
        <h2 className="text-sm font-bold font-mono text-[#1a365d] uppercase tracking-widest">
          NEW RECORD SUBMISSION
        </h2>
        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200 rounded">
          FORM LSPD-1040
        </span>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-xs font-mono flex items-center gap-2.5">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs font-mono flex items-center gap-2.5">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-1.5 font-mono">
            Report Title
          </label>
          <input
            id="title"
            type="text"
            required
            disabled={isSubmitting}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Code 3 Pursuit - 10-80"
            className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-150"
          />
        </div>

        <div>
          <label htmlFor="streamableUrl" className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-1.5 font-mono">
            Streamable Video Link
          </label>
          <input
            id="streamableUrl"
            type="url"
            required
            disabled={isSubmitting}
            value={streamableUrl}
            onChange={(e) => setStreamableUrl(e.target.value)}
            placeholder="e.g., https://streamable.com/abcde"
            className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-150 font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="incidentDate" className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-1.5 font-mono">
              Incident Date / Time
            </label>
            <input
              id="incidentDate"
              type="datetime-local"
              required
              disabled={isSubmitting}
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-[#1a365d] focus:outline-none transition-all duration-150 font-mono text-xs"
            />
          </div>

          <div>
            <label htmlFor="caseNumber" className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-1.5 font-mono">
              Case Number (Optional)
            </label>
            <input
              id="caseNumber"
              type="text"
              disabled={isSubmitting}
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="e.g., LSPD-2026-987"
              className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-150 font-mono text-xs uppercase"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-1.5 font-mono">
            Incident Summary
          </label>
          <textarea
            id="description"
            required
            rows={4}
            disabled={isSubmitting}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a chronological description of the event, including responding units and actions taken..."
            className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-150 text-xs leading-relaxed resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center bg-[#1a365d] hover:bg-[#1e3a6a] active:bg-[#152d4d] text-white text-xs font-mono font-bold uppercase tracking-widest py-3 px-4 rounded-lg border border-blue-700/40 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "TRANSMITTING DATA..." : "COMMIT TO ARCHIVE"}
        </button>
      </form>
    </div>
  );
}
