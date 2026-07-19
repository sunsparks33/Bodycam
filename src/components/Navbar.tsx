"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface NavbarProps {
  user?: {
    id: string;
    name?: string | null;
    badgeNumber: string;
    role: "OFFICER" | "HIGH_COMMAND";
  };
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="relative h-16 w-full bg-slate-900/90 border-b border-blue-900/30 flex items-center justify-between px-6 z-50 backdrop-blur-md">
      {/* Decorative top pulse strip */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Left side: System Branding */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="City of Los Santos Seal"
          className="w-8 h-8 object-contain"
        />
        <span className="font-sans font-extrabold tracking-widest text-slate-100 uppercase text-xs sm:text-sm">
          RED LSPD BODYCAM SYSTEM
        </span>
      </div>

      {/* Center: Route Navigation */}
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
            isActive("/dashboard")
              ? "text-blue-400 border-b-2 border-blue-500 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/officers"
          className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
            isActive("/officers")
              ? "text-blue-400 border-b-2 border-blue-500 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Officers
        </Link>
        {user.role === "HIGH_COMMAND" && (
          <Link
            href="/archive"
            className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
              isActive("/archive")
                ? "text-cyan-400 border-b-2 border-cyan-500 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Master Archive
          </Link>
        )}
      </div>

      {/* Right side: User Profile & Actions */}
      <div className="flex items-center gap-4">
        {/* User Info Block */}
        <div className="flex flex-col text-right font-mono hidden sm:flex">
          <span className="text-[11px] text-slate-400">
            Logged in as:{" "}
            <span className="text-slate-100 font-bold">
              Badge #{user.badgeNumber}
            </span>
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold ${
              user.role === "HIGH_COMMAND" ? "text-cyan-400" : "text-blue-400"
            }`}
          >
            {user.role === "HIGH_COMMAND" ? "High Command" : "Officer"}
          </span>
        </div>

        {/* Mobile Info Pill */}
        <span className="font-mono text-[10px] bg-slate-950 px-2.5 py-1 border border-slate-800 rounded sm:hidden text-slate-300">
          #{user.badgeNumber}
        </span>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60 hover:border-slate-500 hover:text-red-400 text-slate-300 rounded shadow-md transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
