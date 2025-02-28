import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user?.id },
      select:{isAdmin:true, isBanned:true}
    });    
    if(!user?.isAdmin){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const stats = {totalUsers:0, applications: 0, events: 0, projects:0};
    stats.totalUsers = await prisma.user.count();
    stats.applications = await prisma.application.count();
    stats.events = await prisma.event.count();
    // stats.projects = await prisma.project.count();

    return NextResponse.json(stats, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to Fetch stats" },
      { status: 500 }
    );
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};