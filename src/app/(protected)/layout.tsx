import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Server-side fallback protection
  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background Grid Pattern matching police MDC style */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.18)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Centered Faded LSPD Logo Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <img
          src="/logo.png"
          alt="LSPD Watermark Seal"
          className="w-[500px] sm:w-[650px] md:w-[750px] aspect-square object-contain opacity-[0.04] filter brightness-125 select-none pointer-events-none"
        />
      </div>

      <Navbar user={session.user} />
      <main className="relative z-10 flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
