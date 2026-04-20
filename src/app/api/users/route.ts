import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { reputation: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        image: true,
        reputation: true,
        role: true,
        _count: {
          select: { questions: true, answers: true },
        },
        badges: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
