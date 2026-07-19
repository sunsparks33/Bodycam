/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      badgeNumber: string;
      role: "OFFICER" | "HIGH_COMMAND";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    badgeNumber: string;
    role: "OFFICER" | "HIGH_COMMAND";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    badgeNumber: string;
    role: "OFFICER" | "HIGH_COMMAND";
  }
}
