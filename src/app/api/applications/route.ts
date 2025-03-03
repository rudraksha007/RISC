import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const session = await getServerSession(authOptions);
    if(!session || !session.user.email) return NextResponse.json({msg: 'Unauthorised'}, {status: 401});
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        include: {
            applications: true
        }
    });
    console.log(user?.applications);
    
    if(!user)return NextResponse.json({msg: 'Unauthorised'}, {status: 401});
    if(!user?.isAdmin) return NextResponse.json(user.applications, {status: 200});
    else{
        const applications = await prisma.application.findMany({});
        return NextResponse.json(applications, {status: 200});
    }
}