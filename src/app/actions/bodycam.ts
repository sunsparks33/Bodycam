"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SubmitClipInput {
  title: string;
  streamableUrl: string;
  incidentDate: string; // Will be parsed to a Date object
  caseNumber?: string;
  description: string;
}

export async function submitBodycamClip(input: SubmitClipInput) {
  // 1. Get current authenticated user's session
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: You must be logged in to submit clips.");
  }

  const uploaderId = session.user.id;

  // 2. Validate basic inputs
  if (!input.title || !input.streamableUrl || !input.incidentDate || !input.description) {
    throw new Error("BAD REQUEST: Missing required fields.");
  }

  try {
    // 3. Create the database record via Prisma
    const clip = await prisma.bodycamClip.create({
      data: {
        title: input.title,
        streamableUrl: input.streamableUrl,
        incidentDate: new Date(input.incidentDate),
        caseNumber: input.caseNumber || null,
        description: input.description,
        uploaderId: uploaderId,
      },
    });

    // 4. Revalidate the dashboard path to trigger cache update
    revalidatePath("/dashboard");

    return {
      success: true,
      clipId: clip.id,
    };
  } catch (error) {
    console.error("Failed to submit bodycam clip:", error);
    throw new Error("INTERNAL SERVER ERROR: Database insertion failed.");
  }
}
