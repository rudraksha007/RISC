import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure your Prisma client is properly configured

export async function POST(request: Request) {
    try {
        const { id } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isAdmin: false, isMember: false },
        });

        return NextResponse.json({ updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error updating user" }, { status: 500 });
    }
}