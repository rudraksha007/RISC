import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });
    if (!user) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    const project = await prisma.project.findUnique({
        where: { id: decodeURIComponent(params.id) },
        include:{
            members: true,
            applications: true
        }
    });
    if (!project) return NextResponse.json({ msg: "Project not found" }, { status: 404 });
    if (!user?.isAdmin) {
        if (project.members.some((member) => member.id === user.id)) {
            return NextResponse.json(project, { status: 200 });
        } else {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }
    }else{
        return NextResponse.json(project, { status: 200 });
    }
}