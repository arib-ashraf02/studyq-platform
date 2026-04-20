import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, image: true, reputation: true, role: true, bio: true } },
        tags: true,
        answers: {
          include: {
            author: { select: { id: true, name: true, image: true, reputation: true } },
            comments: {
              include: {
                author: { select: { id: true, name: true, image: true } },
                replies: {
                  include: {
                    author: { select: { id: true, name: true, image: true } },
                  },
                },
              },
              where: { parentId: null },
              orderBy: { createdAt: "asc" },
            },
            _count: { select: { votes: true } },
          },
          orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
        },
        comments: {
          include: {
            author: { select: { id: true, name: true, image: true } },
            replies: {
              include: {
                author: { select: { id: true, name: true, image: true } },
              },
            },
          },
          where: { parentId: null },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { votes: true, answers: true } },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Increment views
    await prisma.question.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("GET /api/questions/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}
