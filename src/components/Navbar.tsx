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
    <nav className="relative h-16 w-full bg-[#1a365d] border-b border-blue-800 flex items-center justify-between px-6 z-50 shadow-md">
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

      {/* Left side: System Branding */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="City of Los Santos Seal"
          className="w-8 h-8 object-contain"
        />
        <span className="font-sans font-extrabold tracking-widest text-white uppercase text-xs sm:text-sm">
          RED LSPD BODYCAM SYSTEM
        </span>
      </div>

      {/* Center: Route Navigation */}
      <div className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
            isActive("/dashboard")
              ? "text-white border-b-2 border-blue-300 font-bold"
              : "text-blue-200/70 hover:text-white"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/officers"
          className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
            isActive("/officers")
              ? "text-white border-b-2 border-blue-300 font-bold"
              : "text-blue-200/70 hover:text-white"
          }`}
        >
          Officers
        </Link>
        {user.role === "HIGH_COMMAND" && (
          <Link
            href="/archive"
            className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
              isActive("/archive")
                ? "text-white border-b-2 border-blue-300 font-bold"
                : "text-blue-200/70 hover:text-white"
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
          <span className="text-[11px] text-blue-200/70">
            Logged in as:{" "}
            <span className="text-white font-bold">
              Badge #{user.badgeNumber}
            </span>
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold ${
              user.role === "HIGH_COMMAND" ? "text-blue-300" : "text-blue-200/80"
            }`}
          >
            {user.role === "HIGH_COMMAND" ? "High Command" : "Officer"}
          </span>
        </div>

        {/* Mobile Info Pill */}
        <span className="font-mono text-[10px] bg-blue-900 px-2.5 py-1 border border-blue-700 rounded sm:hidden text-blue-200">
          #{user.badgeNumber}
        </span>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 hover:border-white/40 text-white rounded shadow-md transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
