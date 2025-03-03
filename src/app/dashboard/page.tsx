"use client";

import { motion } from "framer-motion";
import { Users, FileText, Calendar, Award, ArrowUpRight, Notebook as Robot } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InnerLayout from "../innerLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Protected from "../api/auth/Protected";


const achievements = [
    "🏆 National Robotics Championship 2024 - 1st Place",
    "🌟 Best Innovation Award - Tech Expo 2024",
    "🎯 Successfully completed 15 community projects",
    "🚀 Published 5 research papers in robotics",
];

type StatsType = {
    totalUsers: {
        name: string;
        value: number;
        description: string;
        icon: typeof Users;
    };
    applications: {
        name: string;
        value: number;
        description: string;
        icon: typeof FileText;
    };
    events: {
        name: string;
        value: number;
        description: string;
        icon: typeof Calendar;
    };
    projects: {
        name: string;
        value: number;
        description: string;
        icon: typeof Robot;
    };
};

export default function DashboardPage() {
    const [stats, setStats] = useState<StatsType>({
        totalUsers: {
            name: "Total Members",
            value: 0,
            description: "Active club members",
            icon: Users,
        },
        applications: {
            name: "Applications",
            value: 0,
            description: "Pending reviews",
            icon: FileText,
        },
        events: {
            name: "Events",
            value: 0,
            description: "Upcoming events",
            icon: Calendar,
        },
        projects: {
            name: "Projects",
            value: 0,
            description: "Ongoing projects",
            icon: Robot,
        },
    });
    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/admin/stats", { method: "POST" });
                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }
                const data = await response.json();
                console.log(data);
                Object.entries(data).forEach(([key, value]) => {
                    // @ts-ignore-error
                    setStats((prevStat) => ({ ...prevStat, [key]: { ...prevStat[key], value: value } }));
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }
        fetchStats();
    }
        , []);
    const router = useRouter();
    return (
        <InnerLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back!</h1>
                        <p className="text-muted-foreground">
                            Here's what's happening in RISC Robotics
                        </p>
                    </div>
                    <Button onClick={() => router.push("/projects/create")}>
                        Create New Project
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(stats).map(([key, stat], index) => {
                        if (key == 'totalUsers' && stat.value == 0) {
                            return null;
                        }
                        return (<motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.name}
                                    </CardTitle>
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        )
                    })}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Achievements</CardTitle>
                            <CardDescription>
                                Latest milestones and recognition
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {achievements.map((achievement, index) => (
                                    <motion.div
                                        key={achievement}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <Award className="h-5 w-5 text-primary" />
                                        <span>{achievement}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Button variant="outline" className="justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Review Applications
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Event
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                Manage Members
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <Robot className="mr-2 h-4 w-4" />
                                Create Project
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </InnerLayout>
    );
}