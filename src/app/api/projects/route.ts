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
            leadProjects: {
                include: {
                    members: true
                }
            },
            roles: {
                include: {
                    project: true
                }
            }
        }
    });
    if (!user) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    if (!user?.isAdmin) {
        return NextResponse.json([...user.leadProjects, ...user.roles.map(
            role => role.project
        )], { status: 200 });
    }
    else {
        const projects = await prisma.project.findMany();
        return NextResponse.json(projects, { status: 200 });
    }
}