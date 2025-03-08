import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    const users = await prisma.user.findMany({
        select:{
            id: true,
            name: true,
            regno: true,
            avatar: true,
            leadProjects: {
                select: {
                    id: true
                }
            },
            roles: {
                select: {
                    projectId: true
                }
            }
        }
    })
    // if (!user) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    return NextResponse.json(users, { status: 200 });
}