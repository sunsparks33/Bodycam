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
    <div className="relative min-h-screen flex items-center justify-center bg-[#f0f4f8] font-sans text-slate-800 overflow-hidden">
      {/* Subtle blue gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,rgba(240,244,248,1)_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Giant faded logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <img
          src="/logo.png"
          alt="LSPD Watermark Seal"
          className="w-[450px] sm:w-[550px] aspect-square object-contain opacity-[0.06] select-none pointer-events-none"
        />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md mx-4 z-10 animate-slideUp">
        <div className="bg-white border border-blue-200 rounded-xl shadow-xl shadow-blue-900/10 p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:border-blue-400/50 hover:shadow-blue-500/15">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />

          {/* Centered LSPD Header Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4 bg-blue-50 p-3 rounded-full border border-blue-200">
              <img
                src="/logo.png"
                alt="City of Los Santos Seal"
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold tracking-wider text-[#1a365d] uppercase sm:text-2xl font-mono">
              RED LSPD MASTER ARCHIVE
            </h1>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-red-600 uppercase tracking-widest font-mono">
                Authorized Personnel Only
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm flex items-start gap-3 font-mono">
              <svg
                className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
                className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-2 font-mono"
              >
                Badge Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2.5 pl-10 pr-4 text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-200 font-mono text-center tracking-widest text-lg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#1a365d] uppercase tracking-wider mb-2 font-mono"
              >
                Security Passcode
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                  className="w-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg py-2.5 pl-10 pr-4 text-[#1a365d] placeholder-blue-300 focus:outline-none transition-all duration-200 font-mono text-center tracking-widest text-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center bg-[#1a365d] hover:bg-[#1e3a6a] active:bg-[#152d4d] text-white font-bold py-3 px-4 rounded-lg border border-blue-700/40 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-blue-100 flex items-center justify-between text-[10px] text-blue-400 font-mono">
            <span>SECURE CONN // AES-256</span>
            <span>SYSTEM STATE: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
