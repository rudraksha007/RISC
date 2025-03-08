"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    Inbox,
    Search,
    Star,
    Trash2,
    Archive,
    Mail,
    MailOpen,
    Clock,
    Users,
    Filter,
    Loader2,
    CheckCircle2,
    XCircle,
    Bell,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import InnerLayout from "../innerLayout";

interface Message {
    id: string;
    type: "invitation" | "announcement" | "notification";
    subject: string;
    content: string;
    sender: {
        name: string;
        avatar: string;
        email: string;
    };
    project?: {
        id: string;
        name: string;
        role: string;
    };
    status: "unread" | "read";
    starred: boolean;
    timestamp: string;
}


export default function InboxPage() {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const filteredMessages = useMemo(() => messages.filter((message) => {
        const matchesSearch =
            searchQuery === "" ||
            message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.sender.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
            typeFilter === "all" || message.type === typeFilter;

        return matchesSearch && matchesType;
    }), [messages, searchQuery, typeFilter]);

    useEffect(() => {
        async function fetchMessages() {
            setIsLoading(true);
            try {
                const resp = await fetch("/api/inbox");
                const data = await resp.json();
                setMessages(data);
            } catch (err: any) {
                toast.error("Failed to fetch messages. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchMessages();
    }, []);

    const handleMessageClick = (message: Message) => {
        setSelectedMessage(message);
        setIsDialogOpen(true);
    };

    const handleInvitationResponse = async (accept: boolean) => {
        if (!selectedMessage?.project) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success(
                accept
                    ? "Successfully joined the project!"
                    : "Invitation declined successfully"
            );
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to process your response. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getMessageIcon = (type: string) => {
        switch (type) {
            case "invitation":
                return <Users className="h-4 w-4" />;
            case "announcement":
                return <Mail className="h-4 w-4" />;
            case "notification":
                return <Bell className="h-4 w-4" />;
            default:
                return <Mail className="h-4 w-4" />;
        }
    };

    const getMessageTypeColor = (type: string) => {
        switch (type) {
            case "invitation":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "announcement":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "notification":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
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
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Inbox className="h-8 w-8" />
                            Inbox
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your messages and project invitations
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search messages..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <div className="flex items-center">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Filter by type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Messages</SelectItem>
                                    <SelectItem value="invitation">Invitations</SelectItem>
                                    <SelectItem value="announcement">Announcements</SelectItem>
                                    <SelectItem value="notification">Notifications</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">Status</TableHead>
                                        <TableHead className="w-[140px]">Type</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="w-[180px]">From</TableHead>
                                        <TableHead className="w-[120px]">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading &&
                                        <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    }
                                    {!isLoading && filteredMessages.map((message) => (
                                        <TableRow
                                            key={message.id}
                                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${message.status === "unread" ? "font-medium" : ""
                                                }`}
                                            onClick={() => handleMessageClick(message)}
                                        >
                                            <TableCell>
                                                {message.status === "unread" ? (
                                                    <Mail className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getMessageTypeColor(message.type)}>
                                                    <span className="flex items-center">
                                                        {getMessageIcon(message.type)}
                                                        <span className="ml-1 capitalize">{message.type}</span>
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {message.starred && (
                                                        <Star className="h-4 w-4 text-yellow-400" />
                                                    )}
                                                    <span>{message.subject}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback>{message.sender.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{message.sender.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(message.timestamp).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {!isLoading && filteredMessages.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Inbox className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">No messages found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Message Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        {selectedMessage && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center justify-between">
                                        <Badge className={getMessageTypeColor(selectedMessage.type)}>
                                            <span className="flex items-center">
                                                {getMessageIcon(selectedMessage.type)}
                                                <span className="ml-1 capitalize">
                                                    {selectedMessage.type}
                                                </span>
                                            </span>
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const message = { ...selectedMessage };
                                                message.starred = !message.starred;
                                                setSelectedMessage(message);
                                            }}
                                        >
                                            <Star
                                                className={`h-4 w-4 ${selectedMessage.starred
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                                    }`}
                                            />
                                        </Button>
                                    </div>
                                    <DialogTitle className="text-xl mt-2">
                                        {selectedMessage.subject}
                                    </DialogTitle>
                                    <DialogDescription>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {selectedMessage.sender.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{selectedMessage.sender.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedMessage.sender.email}
                                                </p>
                                            </div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-4">
                                    <p className="text-muted-foreground">{selectedMessage.content}</p>

                                    {selectedMessage.project && (
                                        <div className="mt-6 space-y-4">
                                            <Separator />
                                            <div className="space-y-2">
                                                <h4 className="font-medium">Project Details</h4>
                                                <div className="space-y-1">
                                                    <p className="text-sm">
                                                        <span className="text-muted-foreground">
                                                            Project Name:
                                                        </span>{" "}
                                                        {selectedMessage.project.name}
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="text-muted-foreground">Role:</span>{" "}
                                                        {selectedMessage.project.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="mt-6">
                                    {selectedMessage.type === "invitation" && (
                                        <div className="flex gap-2 w-full">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handleInvitationResponse(false)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Decline
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                className="flex-1"
                                                onClick={() => handleInvitationResponse(true)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Accept
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>
        </InnerLayout>
    );
}