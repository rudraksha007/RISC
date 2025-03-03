import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { TechStacks } from "@prisma/client";
import { getServerSession } from "next-auth";

interface fields {
    name: string;
    description: string;
    problem: string;
    approach: string;
    duration: {
        value: string;
        unit: "days" | "weeks" | "months";
    };
    budget: string;
    techStacks: string[];
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    console.log(session);
    
    if (!session || !session.user.email) return new Response(JSON.stringify({ msg: "Unauthorized" }), { status: 401 });
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })
    const data = await req.json() as fields;

    try {
        let durationInDays = parseInt(data.duration.value);
        if (data.duration.unit === "weeks") {
            durationInDays *= 7;
        } else if (data.duration.unit === "months") {
            durationInDays *= 30; // Assuming 1 month = 30 days
        }

        const newProject = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                problem: data.problem,
                approach: data.approach,
                duration: durationInDays,
                budget: parseFloat(data.budget),
                techStacks: data.techStacks.map((tech) => (tech.toUpperCase() as TechStacks)),
                members: {
                    connect: { id: user?.id }
                },
                lead: { connect: { id: user?.id } }
            },
        });

        if (!newProject) {
            return new Response(JSON.stringify({ error: 'Failed to create project' }), {status: 500,});
        }
        return new Response(JSON.stringify(newProject), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create project' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}