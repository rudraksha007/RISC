import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title, content, category, isPrivate, media } = await req.json();
    if (!title || !category || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        isPrivate: isPrivate as boolean,
        authorId: session.user?.email||"",
        ...(media ? { media } : {}),
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};