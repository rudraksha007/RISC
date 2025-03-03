"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
    Rocket,
    Calendar,
    DollarSign,
    Users,
    Code,
    ArrowLeft,
    Clock,
    Plus,
    MessageSquare,
    FileText,
    Package,
    CalendarDays,
    HelpCircle,
    MoreHorizontal,
    Loader2,
    CheckCircle2,
    XCircle,
    ClockIcon,
} from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InnerLayout from "@/app/innerLayout";
import { Application, ApplicationStatus, ApplicationType, Project, User } from "@prisma/client";

// Sample project data
// const project = {
//     id: "1",
//     name: "Autonomous Delivery Robot",
//     description: "Building a robot that can navigate campus to deliver packages autonomously using advanced computer vision and path planning algorithms.",
//     problem: "Manual package delivery across campus is time-consuming and inefficient, especially during peak hours or bad weather conditions.",
//     approach: "We're developing a wheeled robot with stereo cameras and LiDAR for obstacle detection, using ROS for navigation and a custom app for delivery requests and tracking.",
//     status: "active",
//     progress: 65,
//     budget: 25000,
//     duration: "3 months",
//     startDate: "2024-03-15",
//     endDate: "2024-06-15",
//     techStacks: ["ROS", "Computer Vision", "Arduino", "3D Printing", "Python", "React Native"],
//     members: [
//         { id: "1", name: "Aditya Sharma", role: "Project Lead", avatar: "AS" },
//         { id: "2", name: "Priya Patel", role: "Hardware Engineer", avatar: "PP" },
//         { id: "3", name: "Rahul Gupta", role: "Software Developer", avatar: "RG" },
//         { id: "4", name: "Neha Singh", role: "Computer Vision Specialist", avatar: "NS" },
//     ],
//     updates: [
//         {
//             id: "1",
//             author: "Aditya Sharma",
//             avatar: "AS",
//             content: "Completed the initial prototype design. The chassis is now ready for component mounting.",
//             timestamp: "2024-03-20T10:30:00Z",
//             attachments: ["prototype_design.pdf"],
//         },
//         {
//             id: "2",
//             author: "Priya Patel",
//             avatar: "PP",
//             content: "Motors and wheels have been attached. Initial movement tests are successful, but we need to improve the turning radius.",
//             timestamp: "2024-03-25T14:45:00Z",
//             attachments: [],
//         },
//         {
//             id: "3",
//             author: "Rahul Gupta",
//             avatar: "RG",
//             content: "Basic navigation algorithm implemented. The robot can now follow a predefined path and avoid static obstacles.",
//             timestamp: "2024-04-02T09:15:00Z",
//             attachments: ["navigation_demo.mp4"],
//         },
//     ],
//     applications: [
//         {
//             id: "1",
//             type: "component",
//             title: "Arduino Mega 2560",
//             description: "Need an additional Arduino board for sensor integration",
//             status: "approved",
//             applicant: "Priya Patel",
//             submittedAt: "2024-03-18T11:20:00Z",
//             quantity: 1,
//             estimatedCost: 3500,
//         },
//         {
//             id: "2",
//             type: "leave",
//             title: "Workshop Attendance",
//             description: "Need to attend a robotics workshop at IIT Delhi",
//             status: "pending",
//             applicant: "Rahul Gupta",
//             submittedAt: "2024-04-05T15:30:00Z",
//             fromDate: "2024-04-15",
//             toDate: "2024-04-17",
//         },
//         {
//             id: "3",
//             type: "query",
//             title: "Integration with Campus App",
//             description: "Need clarification on how to integrate with the existing campus app for delivery requests",
//             status: "rejected",
//             applicant: "Neha Singh",
//             submittedAt: "2024-03-30T09:45:00Z",
//             priority: "medium",
//         },
//     ],
// };

// Form schemas
const updateSchema = z.object({
    content: z.string().min(10, "Update must be at least 10 characters"),
    attachments: z.array(z.string()).optional(),
});

const componentSchema = z.object({
    title: z.string().min(3, "Component name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    quantity: z.string().min(1, "Quantity is required"),
    estimatedCost: z.string().min(1, "Estimated cost is required"),
});

const leaveSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
});

const querySchema = z.object({
    title: z.string().min(3, "Query title must be at least 3 characters"),
    description: z.string().min(10, "Query must be at least 10 characters"),
    priority: z.string().min(1, "Priority is required"),
});

export default function ProjectDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [activeTab, setActiveTab] = useState("overview");
    const [applicationTab, setApplicationTab] = useState("all");
    const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
    const [applicationType, setApplicationType] = useState<"component" | "leave" | "query">("component");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
    // const [filteredUpdates, setFilteredUpdates] = useState<Application[]>([]);

    useEffect(() => {
        async function fetchData() {
            const resp = await fetch(`/api/projects/${params.id}`);
            const data = await resp.json();
            console.log(data);
            setProject(data)
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(!project) return;
        //@ts-ignore
        setFilteredApplications(project.applications.filter((app: Application) => {
            if (applicationTab === "all") return true;
            return app.applicationType === applicationTab;
        }));
    }, [project])

    // Update form
    const updateForm = useForm<z.infer<typeof updateSchema>>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            content: "",
            attachments: [],
        },
    });

    // Component request form
    const componentForm = useForm<z.infer<typeof componentSchema>>({
        resolver: zodResolver(componentSchema),
        defaultValues: {
            title: "",
            description: "",
            quantity: "",
            estimatedCost: "",
        },
    });

    // Leave request form
    const leaveForm = useForm<z.infer<typeof leaveSchema>>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            title: "",
            description: "",
            fromDate: "",
            toDate: "",
        },
    });

    // Query form
    const queryForm = useForm<z.infer<typeof querySchema>>({
        resolver: zodResolver(querySchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "",
        },
    });

    const onSubmitUpdate = async (values: z.infer<typeof updateSchema>) => {
        try {
            setIsSubmitting(true);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Update posted successfully!");
            updateForm.reset();
        } catch (error) {
            toast.error("Failed to post update. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitApplication = async () => {
        try {
            setIsSubmitting(true);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            let values;
            switch (applicationType) {
                case "component":
                    values = componentForm.getValues();
                    componentForm.reset();
                    break;
                case "leave":
                    values = leaveForm.getValues();
                    leaveForm.reset();
                    break;
                case "query":
                    values = queryForm.getValues();
                    queryForm.reset();
                    break;
            }

            toast.success(`${applicationType} application submitted successfully!`);
            setApplicationDialogOpen(false);
        } catch (error) {
            toast.error("Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const getApplicationIcon = (type: string) => {
        switch (type) {
            case "component":
                return <Package className="h-4 w-4" />;
            case "leave":
                return <CalendarDays className="h-4 w-4" />;
            case "query":
                return <HelpCircle className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getApplicationTypeColor = (type: string) => {
        switch (type) {
            case "component":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "leave":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "query":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
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
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                    <Badge
                        className={`${getStatus(project?.createdAt || new Date(), project?.duration || 0) === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            } capitalize px-3 py-1`}
                    >
                        {getStatus(project?.createdAt || new Date(), project?.duration || 0)}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Project Overview */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl">{project?.name}</CardTitle>
                                        <CardDescription>
                                            Started on {new Date(project?.createdAt || new Date()).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                                <DropdownMenuItem>Archive Project</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    Delete Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{getProgress(project?.createdAt || new Date(), project?.duration || 0)}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full"
                                            style={{ width: `${getProgress(project?.createdAt || new Date(), project?.duration || 0)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            Duration
                                        </span>
                                        <span className="font-medium">{project?.duration}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <DollarSign className="mr-1 h-3 w-3" />
                                            Budget
                                        </span>
                                        <span className="font-medium">₹{project?.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Users className="mr-1 h-3 w-3" />
                                            Team Size
                                        </span>
                                        {/**@ts-ignore */}
                                        <span className="font-medium">{project?.members?.length} members</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Deadline
                                        </span>
                                        <span className="font-medium">{getEndDate(project?.createdAt || new Date(), project?.duration || 0).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">Description</h3>
                                    <p className="text-sm text-muted-foreground text-wrap break-words">{project?.description}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">Problem Statement</h3>
                                    <p className="text-sm text-muted-foreground text-wrap break-words">{project?.problem}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">Approach</h3>
                                    <p className="text-sm text-muted-foreground text-wrap break-words">{project?.approach}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-wrap">Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project?.techStacks.map((tech) => (
                                            <Badge key={tech} variant="outline" className="flex items-center">
                                                <Code className="mr-1 h-3 w-3" />
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Team Members */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Team Members</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/**@ts-ignore */}
                                {project?.members.map((member: User) => (
                                    <div key={member.id} className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarFallback>{member.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{project.leadId === member.id ? "Project Lead" : 'Member'}</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Team Member
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full justify-start">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Submit Application
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Submit New Application</DialogTitle>
                                            <DialogDescription>
                                                Choose the type of application you want to submit
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Tabs defaultValue="component" onValueChange={(value) => setApplicationType(value as any)}>
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="component">Component</TabsTrigger>
                                                <TabsTrigger value="leave">Duty Leave</TabsTrigger>
                                                <TabsTrigger value="query">Query</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="component" className="space-y-4 mt-4">
                                                <Form {...componentForm}>
                                                    <form className="space-y-4">
                                                        <FormField
                                                            control={componentForm.control}
                                                            name="title"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Component Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g., Arduino Mega 2560" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={componentForm.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Description</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Explain why this component is needed..."
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={componentForm.control}
                                                                name="quantity"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Quantity</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={componentForm.control}
                                                                name="estimatedCost"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Estimated Cost (₹)</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </TabsContent>
                                            <TabsContent value="leave" className="space-y-4 mt-4">
                                                <Form {...leaveForm}>
                                                    <form className="space-y-4">
                                                        <FormField
                                                            control={leaveForm.control}
                                                            name="title"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Leave Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g., Workshop Attendance" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={leaveForm.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Reason</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Explain the reason for your leave request..."
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={leaveForm.control}
                                                                name="fromDate"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>From Date</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="date" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={leaveForm.control}
                                                                name="toDate"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>To Date</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="date" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </TabsContent>
                                            <TabsContent value="query" className="space-y-4 mt-4">
                                                <Form {...queryForm}>
                                                    <form className="space-y-4">
                                                        <FormField
                                                            control={queryForm.control}
                                                            name="title"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Query Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g., Integration with Campus App" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={queryForm.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Query Details</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
                                                                            placeholder="Describe your query in detail..."
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={queryForm.control}
                                                            name="priority"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Priority</FormLabel>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select priority" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="low">Low</SelectItem>
                                                                            <SelectItem value="medium">Medium</SelectItem>
                                                                            <SelectItem value="high">High</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </form>
                                                </Form>
                                            </TabsContent>
                                        </Tabs>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setApplicationDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={onSubmitApplication} disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Submit Application"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule Meeting
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Team
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs for Updates and Applications */}
                <Tabs defaultValue="applications" onValueChange={setActiveTab} value={activeTab}>
                    <TabsList>
                        {/* <TabsTrigger value="updates">Updates</TabsTrigger> */}
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                    </TabsList>

                    {/* Updates Tab */}
                    {/* <TabsContent value="updates" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Update</CardTitle>
                                <CardDescription>
                                    Share progress, challenges, or achievements with the team
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...updateForm}>
                                    <form onSubmit={updateForm.handleSubmit(onSubmitUpdate)} className="space-y-4">
                                        <FormField
                                            control={updateForm.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="What's the latest on this project?"
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button variant="outline" type="button">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Attachment
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Posting...
                                                    </>
                                                ) : (
                                                    "Post Update"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {project.updates.map((update) => (
                                <Card key={update.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarFallback>{update.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base">{update.author}</CardTitle>
                                                <CardDescription>
                                                    {new Date(update.timestamp).toLocaleString()}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{update.content}</p>
                                        {update.attachments.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-xs text-muted-foreground mb-2">Attachments:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {update.attachments.map((attachment) => (
                                                        <Badge key={attachment} variant="outline" className="flex items-center">
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            {attachment}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent> */}

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-6 mt-6">
                        <div className="flex justify-between items-center">
                            <Tabs defaultValue="all" onValueChange={setApplicationTab} value={applicationTab}>
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value={ApplicationType.COMPONENT}>Components</TabsTrigger>
                                    <TabsTrigger value={ApplicationType.DL}>Leaves</TabsTrigger>
                                    <TabsTrigger value={ApplicationType.QUERY}>Queries</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Application
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Applicant</TableHead>
                                            <TableHead>Submitted</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredApplications.map((app: Application) => (
                                            <TableRow key={app.id}>
                                                <TableCell>
                                                    <Badge className={`${getApplicationTypeColor(app.applicationType)} capitalize`}>
                                                        <span className="flex items-center">
                                                            {getApplicationIcon(app.applicationType)}
                                                            <span className="ml-1">{app.applicationType}</span>
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{app.title}</TableCell> {/**title */}
                                                {/**@ts-ignore */}
                                                <TableCell>{(app.author as User).name}</TableCell>
                                                <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(app.status)}>
                                                        <span className="flex items-center">
                                                            {app.status === ApplicationStatus.APPROVED ? (
                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            ) : app.status === ApplicationStatus.REJECTED ? (
                                                                <XCircle className="mr-1 h-3 w-3" />
                                                            ) : (
                                                                <ClockIcon className="mr-1 h-3 w-3" />
                                                            )}
                                                            {app.status}
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </InnerLayout>
    );
}

function getStatus(startDate: Date, duration: number) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    return new Date() > endDate ? "completed" : "active";
}

function getProgress(startDate: Date, duration: number) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    if (new Date() > endDate) return 100;
    return Math.floor((new Date().getDate() - new Date(startDate).getDate()) / duration);
}
function getEndDate(startDate: Date, duration: number) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    return endDate;
}