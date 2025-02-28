"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Notebook as Robot,
    Clock,
    Users,
    CheckCircle2,
    AlertTriangle,
    Search,
    Plus,
    Filter,
    ArrowUpDown
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import InnerLayout from "../innerLayout";

// Sample projects data
const projectsData = [
    {
        id: 1,
        name: "Autonomous Delivery Robot",
        description: "Building a robot for campus deliveries",
        status: "In Progress",
        members: 8,
        deadline: "Apr 15, 2025",
        role: "admin",
        type: "Hardware"
    },
    {
        id: 2,
        name: "Computer Vision System",
        description: "Developing image recognition for robots",
        status: "Planning",
        members: 5,
        deadline: "May 20, 2025",
        role: "member",
        type: "Software"
    },
    {
        id: 3,
        name: "Swarm Robotics Research",
        description: "Investigating multi-robot coordination",
        status: "Completed",
        members: 12,
        deadline: "Feb 10, 2025",
        role: "admin",
        type: "Research"
    },
    {
        id: 4,
        name: "Robotic Arm Prototype",
        description: "Designing a high-precision robotic arm",
        status: "In Progress",
        members: 6,
        deadline: "Jun 5, 2025",
        role: "member",
        type: "Hardware"
    },
    {
        id: 5,
        name: "Machine Learning for Navigation",
        description: "Implementing ML algorithms for robot navigation",
        status: "In Progress",
        members: 7,
        deadline: "May 12, 2025",
        role: "admin",
        type: "Software"
    },
    {
        id: 6,
        name: "Robotic Competition Entry",
        description: "Preparing for the National Robotics Competition",
        status: "Planning",
        members: 15,
        deadline: "Jul 30, 2025",
        role: "member",
        type: "Competition"
    },
];

const getStatusIcon = (status: any) => {
    switch (status) {
        case "In Progress":
            return <Clock className="h-4 w-4 text-blue-500" />;
        case "Planning":
            return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case "Completed":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        default:
            return <Robot className="h-4 w-4 text-primary" />;
    }
};

export default function ProjectsPage() {
    const [role, setRole] = useState("admin"); // Simulating role: 'admin' or 'member'
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter projects based on role, filter type, and search query
    const filteredProjects = projectsData.filter(project => {
        // Filter by role
        if (role === "member" && project.role !== "member") {
            return false;
        }

        // Filter by type
        if (filter !== "all" && project.type !== filter) {
            return false;
        }

        // Filter by search query
        if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

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
                        <h1 className="text-3xl font-bold">Projects</h1>
                        <p className="text-muted-foreground">
                            {role === "admin" ? "Manage all RISC Robotics projects" : "Your active projects"}
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                                <DialogDescription>
                                    Set up a new project for RISC Robotics
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Form would go here */}
                                <p className="text-muted-foreground">Project creation form would be implemented here</p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Hardware">Hardware</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Competition">Competition</SelectItem>
                        </SelectContent>
                    </Select>
                    <Tabs defaultValue="grid" className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="grid">Grid View</TabsTrigger>
                            <TabsTrigger value="list">List View</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <Tabs defaultValue="grid" className="w-full">
                    <TabsContent value="grid" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-xl">{project.name}</CardTitle>
                                                <span className="flex items-center gap-1 text-sm">
                                                    {getStatusIcon(project.status)}
                                                    {project.status}
                                                </span>
                                            </div>
                                            <CardDescription>{project.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        {project.members} members
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        Due: {project.deadline}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                        {project.type}
                                                    </span>
                                                    <Button variant="ghost" size="sm">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="list" className="mt-0">
                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-medium">
                                                <div className="flex items-center gap-1">
                                                    Project Name
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </th>
                                            <th className="text-left p-4 font-medium">Type</th>
                                            <th className="text-left p-4 font-medium">Status</th>
                                            <th className="text-left p-4 font-medium">Members</th>
                                            <th className="text-left p-4 font-medium">Deadline</th>
                                            <th className="text-right p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.map((project) => (
                                            <tr key={project.id} className="border-b hover:bg-muted/50">
                                                <td className="p-4">
                                                    <div className="font-medium">{project.name}</div>
                                                    <div className="text-sm text-muted-foreground">{project.description}</div>
                                                </td>
                                                <td className=" ">
                                                    <span className="text-xs flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        {project.type}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(project.status)}
                                                        <span>{project.status}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">{project.members}</td>
                                                <td className="p-4">{project.deadline}</td>
                                                <td className="p-4 text-right">
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </InnerLayout>
    );
}