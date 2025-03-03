"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Rocket,
    Calendar,
    DollarSign,
    Users,
    Code,
    MoreHorizontal,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InnerLayout from "../innerLayout";

// Sample project data
const projects = [
    {
        id: "1",
        name: "Autonomous Delivery Robot",
        description: "Building a robot that can navigate campus to deliver packages autonomously.",
        status: "active",
        progress: 65,
        budget: 25000,
        duration: "3 months",
        techStacks: ["ROS", "Computer Vision", "Arduino", "3D Printing"],
        members: 8,
        createdAt: "2024-03-15",
    },
    {
        id: "2",
        name: "Smart Agriculture Drone",
        description: "Developing a drone for monitoring crop health and automated irrigation.",
        status: "planning",
        progress: 20,
        budget: 35000,
        duration: "4 months",
        techStacks: ["Raspberry Pi", "IoT", "Machine Learning", "Sensors"],
        members: 6,
        createdAt: "2024-04-01",
    },
    {
        id: "3",
        name: "Robotic Arm for Medical Assistance",
        description: "Creating a precision robotic arm to assist in medical procedures.",
        status: "completed",
        progress: 100,
        budget: 50000,
        duration: "6 months",
        techStacks: ["C++", "Microcontrollers", "PCB Design", "Actuators"],
        members: 10,
        createdAt: "2023-11-10",
    },
    {
        id: "4",
        name: "Swarm Robotics Research",
        description: "Researching coordination algorithms for multiple robots working together.",
        status: "active",
        progress: 40,
        budget: 30000,
        duration: "5 months",
        techStacks: ["Python", "Machine Learning", "Embedded Systems", "Sensors"],
        members: 7,
        createdAt: "2024-02-20",
    },
];

export default function ProjectsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentTab, setCurrentTab] = useState("all");

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            searchQuery === "" ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || project.status === statusFilter;

        const matchesTab =
            currentTab === "all" ||
            (currentTab === "active" && project.status === "active") ||
            (currentTab === "planning" && project.status === "planning") ||
            (currentTab === "completed" && project.status === "completed");

        return matchesSearch && matchesStatus && matchesTab;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "planning":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "completed":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <InnerLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Projects</h1>
                        <p className="text-muted-foreground">
                            Manage and track all robotics projects
                        </p>
                    </div>
                    <Button onClick={() => router.push("/projects/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Project
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <div className="flex items-center">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select> */}
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Projects</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="planning">Planning</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    <TabsContent value={currentTab} className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge
                                                    className={`${getStatusColor(
                                                        project.status
                                                    )} capitalize`}
                                                >
                                                    {project.status}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                                        <DropdownMenuItem>Manage Team</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <CardTitle className="text-xl mt-2">{project.name}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.techStacks.slice(0, 3).map((tech) => (
                                                        <Badge key={tech} variant="outline" className="text-xs">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                    {project.techStacks.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{project.techStacks.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="w-full bg-muted rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full"
                                                            style={{ width: `${project.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>Progress</span>
                                                        <span>{project.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{project.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span>₹{project.budget.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>{project.members} members</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Code className="h-4 w-4 text-muted-foreground" />
                                                    <span>{project.techStacks.length} technologies</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-12">
                                <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No projects found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filters, or create a new project.
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => router.push("/dashboard/projects/create")}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Project
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </motion.div>
        </InnerLayout>
    );
}