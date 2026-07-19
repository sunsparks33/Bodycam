"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

interface CreateOfficerInput {
  username: string;
  badgeNumber: string;
  password?: string;
  role: "OFFICER" | "HIGH_COMMAND";
}

export async function createOfficer(input: CreateOfficerInput) {
  // 1. Get current authenticated user's session
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Session not found.");
  }

  // 2. Enforce High Command / Admin authorization check
  if (session.user.role !== "HIGH_COMMAND") {
    throw new Error("UNAUTHORIZED: Only High Command personnel can register new officers.");
  }

  // 3. Validate input fields
  if (!input.username || !input.badgeNumber || !input.role) {
    throw new Error("BAD REQUEST: Missing required fields.");
  }

  const badge = input.badgeNumber.trim();
  const name = input.username.trim();
  const rawPassword = input.password?.trim() || "lspd123"; // Default fallback passcode

  try {
    // 4. Check if badge number already exists
    const existingUser = await prisma.user.findUnique({
      where: { badgeNumber: badge },
    });

    if (existingUser) {
      throw new Error("BAD REQUEST: Badge number already registered in database.");
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 6. Create the new user record
    const newUser = await prisma.user.create({
      data: {
        username: name,
        badgeNumber: badge,
        password: hashedPassword,
        role: input.role,
      },
    });

    // 7. Revalidate the officers list view cache
    revalidatePath("/officers");

    return {
      success: true,
      officerId: newUser.id,
    };
  } catch (error) {
    console.error("Failed to register officer:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("INTERNAL SERVER ERROR: Database insertion failed.");
  }
}

interface UpdateOfficerInput {
  id: string;
  username: string;
  badgeNumber: string;
  password?: string;
  role: "OFFICER" | "HIGH_COMMAND";
}

export async function updateOfficer(input: UpdateOfficerInput) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Session not found.");
  }

  if (session.user.role !== "HIGH_COMMAND") {
    throw new Error("UNAUTHORIZED: Only High Command personnel can edit officers.");
  }

  if (!input.id || !input.username || !input.badgeNumber || !input.role) {
    throw new Error("BAD REQUEST: Missing required fields.");
  }

  const badge = input.badgeNumber.trim();
  const name = input.username.trim();
  const rawPassword = input.password?.trim();

  try {
    // Check if another user has this badge number
    const existing = await prisma.user.findFirst({
      where: {
        badgeNumber: badge,
        NOT: { id: input.id },
      },
    });

    if (existing) {
      throw new Error("BAD REQUEST: Badge number already in use by another officer.");
    }

    const updateData: {
      username: string;
      badgeNumber: string;
      role: "OFFICER" | "HIGH_COMMAND";
      password?: string;
    } = {
      username: name,
      badgeNumber: badge,
      role: input.role,
    };

    if (rawPassword) {
      updateData.password = await bcrypt.hash(rawPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: input.id },
      data: updateData,
    });

    revalidatePath("/officers");
    revalidatePath("/dashboard");
    revalidatePath("/archive");

    return {
      success: true,
      officerId: updatedUser.id,
    };
  } catch (error) {
    console.error("Failed to update officer:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("INTERNAL SERVER ERROR: Database update failed.");
  }
}

export async function deleteOfficer(officerId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Session not found.");
  }

  if (session.user.role !== "HIGH_COMMAND") {
    throw new Error("UNAUTHORIZED: Only High Command personnel can delete officers.");
  }

  // Prevent self-deletion
  if (officerId === session.user.id) {
    throw new Error("BAD REQUEST: You cannot delete your own account.");
  }

  try {
    // Delete officer's bodycam clips first to avoid foreign key constraint errors
    await prisma.bodycamClip.deleteMany({
      where: { uploaderId: officerId },
    });

    const deletedUser = await prisma.user.delete({
      where: { id: officerId },
    });

    revalidatePath("/officers");
    revalidatePath("/dashboard");
    revalidatePath("/archive");

    return {
      success: true,
      officerId: deletedUser.id,
    };
  } catch (error) {
    console.error("Failed to delete officer:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("INTERNAL SERVER ERROR: Database deletion failed.");
  }
}

