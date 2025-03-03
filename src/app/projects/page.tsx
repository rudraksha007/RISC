"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InnerLayout from "../innerLayout";
import { toast } from "sonner";
import { Project } from "@prisma/client";

function getStatus(startDate: Date, duration: number) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    return new Date() > endDate ? "completed" : "active";
}

function getProgress(startDate: Date, duration: number) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    if(new Date() > endDate) return 100;
    return Math.floor((new Date().getDate()-new Date(startDate).getDate())/duration);
}

export default function ProjectsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentTab, setCurrentTab] = useState("all");
    const [projects, setProjects] = useState<Project[] | []>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]|[]>([]);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch("/api/projects");
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                const data = await response.json();
                console.log(data);
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("Failed to fetch projects");
            }
        }
        fetchProjects();
    }, []);

    useEffect(()=>{
        setFilteredProjects(projects.filter((project) => {
            const matchesSearch =
                searchQuery === "" ||
                project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
            const matchesStatus =
                statusFilter === "all" || getStatus(project.createdAt, project.duration) === statusFilter;
    
            const matchesTab =
                currentTab === "all" ||
                (currentTab === "active" && getStatus(project.createdAt, project.duration) === "active") ||
                (currentTab === "completed" && getStatus(project.createdAt, project.duration) === "completed");
    
            return matchesSearch && matchesStatus && matchesTab;
        }));
    }, [projects, statusFilter, currentTab]);

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
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Projects</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
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
                                                        getStatus(project.createdAt, project.duration)
                                                    )} capitalize`}
                                                >
                                                    {getStatus(project.createdAt, project.duration)}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={()=>router.push(`/projects/${encodeURIComponent(project.id)}`)}>View Details</DropdownMenuItem>
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
                                                            style={{ width: `${getProgress(project.createdAt, project.duration)}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>Progress</span>
                                                        <span>{getProgress(project.createdAt, project.duration)}%</span>
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
                                                    {/**@ts-ignore-next-line */}
                                                    <span>{project.members?.length} members</span>
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