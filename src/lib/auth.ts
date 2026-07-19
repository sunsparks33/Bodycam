import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        badgeNumber: { label: "Badge Number", type: "text", placeholder: "001" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.badgeNumber || !credentials?.password) {
          return null;
        }

        // Find user by badge number
        const user = await prisma.user.findUnique({
          where: {
            badgeNumber: credentials.badgeNumber,
          },
        });

        if (!user) {
          return null;
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // Return user data matching the extended User interface
        return {
          id: user.id,
          name: user.username,
          badgeNumber: user.badgeNumber,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.badgeNumber = user.badgeNumber;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Always refresh from DB to handle re-seeded databases with new IDs/badges
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { id: token.id as string },
              { username: token.name as string },
            ],
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.badgeNumber = dbUser.badgeNumber;
          session.user.role = dbUser.role;
          session.user.name = dbUser.username;
        } else {
          // Fallback to token data if user not found (edge case)
          session.user.id = token.id;
          session.user.badgeNumber = token.badgeNumber;
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
