import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content, authorId } = await req.json();

    if (!content || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        question: { connect: { id: params.id } },
      },
      include: {
        author: { select: { id: true, name: true, image: true, reputation: true } },
      },
    });

    // Update question status
    const answerCount = await prisma.answer.count({
      where: { questionId: params.id },
    });

    await prisma.question.update({
      where: { id: params.id },
      data: {
        status: answerCount >= 1 ? "PARTIALLY_ANSWERED" : "UNANSWERED",
      },
    });

    // Award reputation to answer author
    await prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment: 10 } },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("POST /api/questions/[id]/answers error:", error);
    return NextResponse.json({ error: "Failed to post answer" }, { status: 500 });
  }
}
