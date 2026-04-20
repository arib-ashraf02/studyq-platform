import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search");

    const where: any = {};
    if (status) where.status = status;
    if (tag) where.tags = { some: { name: tag } };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "votes") orderBy = { votes: { _count: "desc" } };
    if (sort === "views") orderBy = { views: "desc" };
    if (sort === "unanswered") {
      where.status = "UNANSWERED";
      orderBy = { createdAt: "desc" };
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy,
      include: {
        author: { select: { id: true, name: true, image: true, reputation: true } },
        tags: true,
        _count: { select: { answers: true, votes: true, comments: true } },
      },
    });

    // Transform to include vote count
    const result = questions.map((q) => ({
      ...q,
      votes: q._count.votes,
      answers: q._count.answers,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/questions error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, difficulty, authorId, tags } = body;

    if (!title || !description || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        description,
        difficulty: difficulty || "MEDIUM",
        author: { connect: { id: authorId } },
        tags: tags?.length
          ? { connectOrCreate: tags.map((t: string) => ({ where: { name: t }, create: { name: t } })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, image: true, reputation: true } },
        tags: true,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("POST /api/questions error:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
