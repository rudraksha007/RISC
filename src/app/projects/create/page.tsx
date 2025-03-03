"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
    Rocket,
    Loader2,
    Calendar,
    DollarSign,
    Code,
    ArrowLeft,
} from "lucide-react";
import { TechStacks } from "@prisma/client";

import {
    Form,
    FormControl,
    FormDescription,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InnerLayout from "@/app/innerLayout";

const formSchema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    problem: z.string().min(50, "Problem statement must be at least 50 characters"),
    approach: z.string().min(50, "Approach must be at least 50 characters"),
    duration: z.object({
        value: z.string().min(1, "Duration value is required"),
        unit: z.enum(["days", "weeks", "months"]),
    }),
    budget: z.string().min(1, "Budget is required"),
    techStacks: z.array(z.string()).min(1, "At least one tech stack is required"),
    dataRequirements: z.array(z.object({
        name: z.string().min(1, "Field name is required"),
        type: z.enum(["text", "number", "email", "date", "boolean"]),
        required: z.boolean().default(false),
        description: z.string().optional(),
    })).optional().default([]),
});


export default function CreateProjectPage() {
    const router = useRouter();
    const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentTab, setCurrentTab] = useState("basic");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            problem: "",
            approach: "",
            duration: {
                value: "",
                unit: "weeks",
            },
            budget: "",
            techStacks: [],
            dataRequirements: [],
        },
    });
    form.watch('techStacks');
    const toggleTechStack = (tech: string) => {
        setSelectedTechStacks((prev) => {
            const newSelection = prev.includes(tech)
                ? prev.filter((t) => t !== tech)
                : [...prev, tech];

            form.setValue("techStacks", newSelection);
            return newSelection;
        });
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            // await new Promise((resolve) => setTimeout(resolve, 1500));
            const response = await fetch("/api/newProject", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Failed to create project");

            toast.success("Project created successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to create project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextTab = () => {
        if (currentTab === "basic") {
            const { name, description, problem } = form.getValues();
            if (!name || !description || !problem) {
                form.trigger(["name", "description", "problem"]);
                return;
            }
            setCurrentTab("details");
        } else if (currentTab === "details") {
            const { approach, duration, budget, techStacks } = form.getValues();
            if (!approach || !duration.value || !budget || techStacks.length === 0) {
                form.trigger(["approach", "duration", "budget", "techStacks"]);
                return;
            }
            setCurrentTab("data");
        }
    };

    const prevTab = () => {
        if (currentTab === "details") {
            setCurrentTab("basic");
        } else if (currentTab === "data") {
            setCurrentTab("details");
        }
    };

    return (
        <InnerLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button>

                <Card className="backdrop-blur-xl bg-background/60 border-muted/20 shadow-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Rocket className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Create New Project</CardTitle>
                                <CardDescription>
                                    Launch a new robotics project for RISC
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                                    <TabsList className="grid w-full grid-cols-2 mb-8">
                                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                        <TabsTrigger value="details">Project Details</TabsTrigger>
                                        {/* <TabsTrigger value="data">Data Requirements</TabsTrigger> */}
                                    </TabsList>

                                    <TabsContent value="basic" className="space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Project Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter project name" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Choose a clear and descriptive name for your project
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Project Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Provide a detailed description of the project..."
                                                                className="min-h-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Explain what the project is about and its objectives
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.2 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="problem"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Problem Statement</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="What problem is this project solving?"
                                                                className="min-h-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Clearly define the problem or challenge this project addresses
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <div className="flex justify-end">
                                            <Button type="button" onClick={nextTab}>
                                                Next Step
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="approach"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Project Approach</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Describe your approach to solving the problem..."
                                                                className="min-h-[120px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Explain the methodology, techniques, and steps you'll take
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="duration"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Expected Duration</FormLabel>
                                                            <div className="flex gap-3">
                                                                <FormControl>
                                                                    <div className="flex-1 flex items-center">
                                                                        <div className="relative flex-1">
                                                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                            <Input
                                                                                type="number"
                                                                                placeholder="Duration"
                                                                                className="pl-10"
                                                                                value={field.value.value}
                                                                                onChange={(e) => {
                                                                                    form.setValue("duration", {
                                                                                        ...field.value,
                                                                                        value: e.target.value,
                                                                                    });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </FormControl>
                                                                <Select
                                                                    value={field.value.unit}
                                                                    onValueChange={(value) => {
                                                                        form.setValue("duration", {
                                                                            ...field.value,
                                                                            unit: value as "days" | "weeks" | "months",
                                                                        });
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="w-[120px]">
                                                                        <SelectValue placeholder="Unit" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="days">Days</SelectItem>
                                                                        <SelectItem value="weeks">Weeks</SelectItem>
                                                                        <SelectItem value="months">Months</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <FormDescription>
                                                                Estimate how long the project will take to complete
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.2 }}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="budget"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Expected Budget (₹)</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Enter budget amount"
                                                                        className="pl-10"
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription>
                                                                Estimate the total cost for this project
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.3 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="techStacks"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>Tech Stacks</FormLabel>
                                                        <FormControl>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 grid-auto-rows">
                                                                {Object.values(TechStacks).map((tech) => (
                                                                    <Button
                                                                        key={tech}
                                                                        type="button"
                                                                        style={{ textWrap: 'wrap' }}
                                                                        variant={
                                                                            selectedTechStacks.includes(tech)
                                                                                ? "default"
                                                                                : "outline"
                                                                        }
                                                                        className="h-auto py-2 px-3 text-sm justify-start"
                                                                        onClick={() => toggleTechStack(tech)}
                                                                    >
                                                                        <Code className="mr-2 h-4 w-4" />
                                                                        {tech}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Select all technologies that will be used in this project
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <div className="flex justify-between">
                                            <Button type="button" variant="outline" onClick={prevTab}>
                                                Previous Step
                                            </Button>
                                            <Button type="submit">
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    "Create Project"
                                                )}
                                            </Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </InnerLayout>
    );
}