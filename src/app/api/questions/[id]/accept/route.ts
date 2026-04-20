import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { answerId } = await req.json();

    // Mark answer as accepted
    await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });

    // Un-accept other answers
    await prisma.answer.updateMany({
      where: { questionId: params.id, id: { not: answerId } },
      data: { isAccepted: false },
    });

    // Mark question as resolved
    await prisma.question.update({
      where: { id: params.id },
      data: { status: "RESOLVED" },
    });

    // Award reputation to the answer author
    const answer = await prisma.answer.findUnique({ where: { id: answerId } });
    if (answer) {
      await prisma.user.update({
        where: { id: answer.authorId },
        data: { reputation: { increment: 25 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/questions/[id]/accept error:", error);
    return NextResponse.json({ error: "Failed to accept answer" }, { status: 500 });
  }
}
