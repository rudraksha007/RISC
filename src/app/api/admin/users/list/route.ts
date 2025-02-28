import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Ensure your Prisma client is properly configured

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        isMember: true,
        isAdmin: true,
        isBanned: true,
        regno: true,
        year: true
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
