"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        badgeNumber,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ACCESS DENIED: Invalid Badge Number or Passcode.");
        setIsLoading(false);
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("SYSTEM ERROR: Authentication failed. Please try again.");
        setIsLoading(false);
      }
    } catch {
      setError("CONNECTION ERROR: Unable to reach authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,32,67,0.3)_0%,rgba(3,7,18,1)_80%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md mx-4 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-2xl p-8 md:p-10 relative overflow-hidden">
          {/* Top Decorative Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />

          {/* Centered LSPD Header Logo / Vibe */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4 bg-slate-900/60 p-2 rounded-full border border-blue-900/30">
              <img
                src="/logo.png"
                alt="City of Los Santos Seal"
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase sm:text-2xl font-mono">
              RED LSPD MASTER ARCHIVE
            </h1>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-red-950/40 border border-red-800/30 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-widest font-mono">
                Authorized Personnel Only
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/60 border-l-4 border-red-500 rounded text-red-200 text-sm flex items-start gap-3 font-mono">
              <svg
                className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="badgeNumber"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono"
              >
                Badge Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  id="badgeNumber"
                  type="text"
                  required
                  disabled={isLoading}
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-slate-950/60 border border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none transition-all duration-200 font-mono text-center tracking-widest text-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono"
              >
                Security Passcode
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-blue-900/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none transition-all duration-200 font-mono text-center tracking-widest text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-4 rounded border border-blue-500/40 hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="font-mono text-sm tracking-wider uppercase">
                    Authenticating...
                  </span>
                </div>
              ) : (
                <span className="font-mono tracking-wider uppercase">
                  Establish Connection
                </span>
              )}
            </button>
          </form>

          {/* Decorative Terminal Vibe Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>SECURE CONN // AES-256</span>
            <span>SYSTEM STATE: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
