"use client";

import { useState } from "react";
import { createOfficer, updateOfficer, deleteOfficer } from "@/app/actions/officers";

interface OfficerUser {
  id: string;
  username: string;
  badgeNumber: string;
  role: "OFFICER" | "HIGH_COMMAND";
}

interface OfficersTableProps {
  officers: OfficerUser[];
  currentUserRole: "OFFICER" | "HIGH_COMMAND";
}

export default function OfficersTable({ officers, currentUserRole }: OfficersTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedOfficer, setSelectedOfficer] = useState<OfficerUser | null>(null);

  const [username, setUsername] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"OFFICER" | "HIGH_COMMAND">("OFFICER");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Add Modal ---
  const handleOpenAdd = () => {
    setIsAddModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseAdd = () => {
    setIsAddModalOpen(false);
    setUsername("");
    setBadgeNumber("");
    setPassword("");
    setRole("OFFICER");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await createOfficer({
        username,
        badgeNumber,
        password: password || undefined,
        role,
      });

      if (res.success) {
        setSuccess("REGISTRATION SUCCESS: Officer added successfully.");
        setUsername("");
        setBadgeNumber("");
        setPassword("");
        setRole("OFFICER");
        setTimeout(() => {
          handleCloseAdd();
        }, 1500);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "REGISTRATION FAILED: Unexpected error.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Edit Modal ---
  const handleOpenEdit = (officer: OfficerUser) => {
    setSelectedOfficer(officer);
    setUsername(officer.username);
    setBadgeNumber(officer.badgeNumber);
    setRole(officer.role);
    setPassword("");
    setError(null);
    setSuccess(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedOfficer(null);
    setUsername("");
    setBadgeNumber("");
    setPassword("");
    setRole("OFFICER");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficer) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateOfficer({
        id: selectedOfficer.id,
        username,
        badgeNumber,
        password: password || undefined,
        role,
      });

      if (res.success) {
        setSuccess("UPDATE SUCCESS: Officer records synchronized.");
        setTimeout(() => {
          handleCloseEdit();
        }, 1500);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "UPDATE FAILED: Unexpected error.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete Modal ---
  const handleOpenDelete = (officer: OfficerUser) => {
    setSelectedOfficer(officer);
    setError(null);
    setSuccess(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedOfficer(null);
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficer) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await deleteOfficer(selectedOfficer.id);

      if (res.success) {
        setSuccess("DELETION SUCCESS: Officer removed from service.");
        setTimeout(() => {
          handleCloseDelete();
        }, 1500);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "DELETION FAILED: Unexpected error.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared input class
  const inputClass = "w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2 px-3 text-xs text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-150 font-mono";
  const labelClass = "block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-1.5 font-mono";

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header section with Add Officer button */}
      <div className="bg-white border border-blue-200 rounded-lg p-5 shadow-sm flex items-center justify-between transition-all duration-300 hover:border-blue-400/60">
        <div>
          <h2 className="text-sm font-bold font-mono tracking-widest text-[#1a365d] uppercase">
            OFFICER DATABASE ROSTER
          </h2>
          <p className="text-[10px] text-blue-500 font-mono mt-1 uppercase tracking-wide">
            Internal registry // Active Duty Records
          </p>
        </div>
        {currentUserRole === "HIGH_COMMAND" && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1a365d] hover:bg-[#1e3a6a] active:bg-[#152d4d] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-700/40 shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            ADD NEW OFFICER
          </button>
        )}
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-blue-200 rounded-lg shadow-sm overflow-x-auto relative transition-all duration-300 hover:border-blue-400/60">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-lg" />

        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-blue-200 bg-blue-50/80 text-[10px] font-mono text-[#1a365d] uppercase tracking-widest select-none">
              <th className="py-4 px-6">Badge Number</th>
              <th className="py-4 px-6">Officer Username</th>
              <th className="py-4 px-6">Duty Role</th>
              {currentUserRole === "HIGH_COMMAND" && (
                <th className="py-4 px-6 text-center">Roster Actions</th>
              )}
              <th className="py-4 px-6 text-right">System ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 text-xs">
            {officers.map((officer) => (
              <tr key={officer.id} className="hover:bg-blue-50/60 transition-colors duration-150">
                <td className="py-4 px-6 font-mono text-blue-600 font-bold">
                  #{officer.badgeNumber}
                </td>
                <td className="py-4 px-6 text-[#1a365d] font-semibold">
                  {officer.username}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded-lg ${
                      officer.role === "HIGH_COMMAND"
                        ? "text-blue-700 bg-blue-50 border-blue-300"
                        : "text-slate-500 bg-slate-50 border-slate-200"
                    }`}
                  >
                    {officer.role === "HIGH_COMMAND" ? "High Command" : "Officer"}
                  </span>
                </td>
                {currentUserRole === "HIGH_COMMAND" && (
                  <td className="py-4 px-6 text-center whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleOpenEdit(officer)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 active:bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(officer)}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 active:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                )}
                <td className="py-4 px-6 text-right font-mono text-slate-400 text-[10px]">
                  {officer.id.substring(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 1. Add Officer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative bg-white border border-blue-200 rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50/60 select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-[#1a365d] uppercase">
                  REGISTER NEW AGENCY ACCOUNT
                </h3>
              </div>
              <button
                onClick={handleCloseAdd}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 hover:bg-blue-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {success && (
                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-xs font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="add-badgeNumber" className={labelClass}>Badge Number</label>
                <input id="add-badgeNumber" type="text" required disabled={isSubmitting} value={badgeNumber} onChange={(e) => setBadgeNumber(e.target.value)} placeholder="e.g. 1045" className={inputClass} />
              </div>

              <div>
                <label htmlFor="add-username" className={labelClass}>Officer Username</label>
                <input id="add-username" type="text" required disabled={isSubmitting} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. J. Miller" className={inputClass} />
              </div>

              <div>
                <label htmlFor="add-password" className={labelClass}>Default Passcode</label>
                <input id="add-password" type="text" disabled={isSubmitting} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Default: lspd123" className={inputClass} />
              </div>

              <div>
                <label htmlFor="add-role" className={labelClass}>Duty Role Authorization</label>
                <select id="add-role" disabled={isSubmitting} value={role} onChange={(e) => setRole(e.target.value as "OFFICER" | "HIGH_COMMAND")} className={inputClass}>
                  <option value="OFFICER">OFFICER (Standard Access)</option>
                  <option value="HIGH_COMMAND">HIGH_COMMAND (Supervisor Access)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleCloseAdd} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-blue-200 bg-white hover:bg-blue-50 active:bg-white text-[#1a365d] rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-[#1a365d] hover:bg-[#1e3a6a] active:bg-[#152d4d] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-blue-700/40 transition-colors">
                  {isSubmitting ? "CREATING..." : "CONFIRM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Officer Modal */}
      {isEditModalOpen && selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative bg-white border border-blue-200 rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50/60 select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-[#1a365d] uppercase">
                  EDIT AGENCY ACCOUNT RECORD
                </h3>
              </div>
              <button
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 hover:bg-blue-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {success && (
                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-xs font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="edit-badgeNumber" className={labelClass}>Badge Number</label>
                <input id="edit-badgeNumber" type="text" required disabled={isSubmitting} value={badgeNumber} onChange={(e) => setBadgeNumber(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label htmlFor="edit-username" className={labelClass}>Officer Username</label>
                <input id="edit-username" type="text" required disabled={isSubmitting} value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label htmlFor="edit-password" className={labelClass}>Reset Passcode (Optional)</label>
                <input id="edit-password" type="text" disabled={isSubmitting} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep unchanged" className={inputClass} />
              </div>

              <div>
                <label htmlFor="edit-role" className={labelClass}>Duty Role Authorization</label>
                <select id="edit-role" disabled={isSubmitting} value={role} onChange={(e) => setRole(e.target.value as "OFFICER" | "HIGH_COMMAND")} className={inputClass}>
                  <option value="OFFICER">OFFICER (Standard Access)</option>
                  <option value="HIGH_COMMAND">HIGH_COMMAND (Supervisor Access)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleCloseEdit} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-blue-200 bg-white hover:bg-blue-50 active:bg-white text-[#1a365d] rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/40 transition-colors">
                  {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Officer Confirmation Modal */}
      {isDeleteModalOpen && selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="relative bg-white border border-red-200 rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-red-100 bg-red-50/60 select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-xs font-bold font-mono tracking-widest text-red-700 uppercase">
                  CRITICAL AUTH DELETION
                </h3>
              </div>
              <button
                onClick={handleCloseDelete}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 hover:bg-red-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDeleteSubmit} className="p-6 space-y-4">
              {success && (
                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-xs font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs font-mono flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {!success && (
                <div className="space-y-3">
                  <p className="text-slate-600 text-xs leading-relaxed font-sans">
                    Are you sure you want to permanently delete the roster record for:
                  </p>
                  <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase">Officer Name:</span>
                      <span className="text-[#1a365d] font-bold">{selectedOfficer.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase">Badge Number:</span>
                      <span className="text-red-600 font-bold">#{selectedOfficer.badgeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase">Duty Role:</span>
                      <span className="text-slate-700 uppercase">{selectedOfficer.role}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-600 leading-relaxed font-mono">
                    [WARNING]: Deleting this account will permanently clear all incident logs and evidence submissions linked to this badge number.
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleCloseDelete} disabled={isSubmitting} className="flex-1 px-4 py-2 border border-blue-200 bg-white hover:bg-blue-50 active:bg-white text-[#1a365d] rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || !!success} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-red-500/40 transition-colors">
                  {isSubmitting ? "DELETING..." : "CONFIRM DELETE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
