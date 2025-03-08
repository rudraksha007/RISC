import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            mailsIn: true,
            mailsOut: true
        }
    });
    if (!user) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    return NextResponse.json([...user.mailsIn, ...user.mailsOut], { status: 200 });
}