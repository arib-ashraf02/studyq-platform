import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { type, userId, questionId, answerId } = await req.json();

    if (!userId || (!questionId && !answerId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for existing vote
    const existingVote = questionId
      ? await prisma.vote.findUnique({ where: { userId_questionId: { userId, questionId } } })
      : await prisma.vote.findUnique({ where: { userId_answerId: { userId, answerId } } });

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote (toggle off)
        await prisma.vote.delete({ where: { id: existingVote.id } });
        return NextResponse.json({ action: "removed", type });
      } else {
        // Change vote direction
        await prisma.vote.update({ where: { id: existingVote.id }, data: { type } });
        return NextResponse.json({ action: "changed", type });
      }
    }

    // Create new vote
    await prisma.vote.create({
      data: {
        type,
        userId,
        ...(questionId ? { questionId } : { answerId }),
      },
    });

    return NextResponse.json({ action: "created", type });
  } catch (error) {
    console.error("POST /api/votes error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
