import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface ReqMembers{
    [userId: string]: string
}

export async function POST(req: Request, {params}: {params: Promise<{id: string}>}){
    const session = await getServerSession(authOptions);
    if(!session || !session.user.email) return NextResponse.json({msg: "Unauthorized"}, {status: 401});
    const user = await prisma.user.findUnique({
        where: {email: session.user.email}
    });
    if(!user) return NextResponse.json({msg: "Unauthorized"}, {status: 401});
    const {id} = await params;
    const project = await prisma.project.findUnique({
        where: {id: decodeURIComponent(id)}
    });
    if(!project) return NextResponse.json({msg: "Project not found"}, {status: 404});
    if(!user.isAdmin && project.leadId !== user.id) return NextResponse.json({msg: "Unauthorized"}, {status: 401});
    const {members}: {members: ReqMembers} = await req.json();
    const res = await prisma.$transaction([
        prisma.role.deleteMany({
            where: {projectId: project.id}
        }),
        prisma.role.createMany({
            data: Object.entries(members).map(([userId, role]) => ({
                projectId: project.id,
                userId,
                name: role
            }))
        })
    ]);
    if(!res) return NextResponse.json({msg: "Failed to update members"}, {status: 500});
    return NextResponse.json({msg: "Members updated successfully"}, {status: 200});
}