"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    Search,
    Users,
    ChevronDown,
    Shield,
    ShieldOff,
    UserMinus,
    Loader2,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import InnerLayout from "@/app/innerLayout";
import Protected from "@/app/api/auth/Protected";

type UserType = "member" | "admin" | "non-member" | "all";

interface User {
    id: string;
    name: string;
    email: string;
    username: string | null;
    avatar: string | null;
    isMember: boolean;
    isAdmin: boolean
    year: 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'FIFTH'
    regno: number
    type: UserType
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [yearFilter, setYearFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<UserType | "">("all");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState<"promote" | "demote" | "remove" | "accept" | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    async function getUsers() {
        setIsPageLoading(true);
        try {
            const response = await fetch("/api/admin/users/list");
            if (response.ok) {
                const data = await response.json();
                console.log(data.users);
                const usersWithTypes = data.users.map((user: User) => ({
                    ...user,
                    type: user.isAdmin ? "admin" : user.isMember ? "member" : "non-member",
                }));
                setUsers(usersWithTypes);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {

            toast.error("An error occurred while fetching users");
        } finally {
            setIsPageLoading(false);
        }
    }
    useEffect(() => {
        getUsers();
    }, []);
    useEffect(() => {
        const filteredUsers = users.filter((user) => {
            const matchesSearch =
                searchQuery === "" ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.regno.toString().toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = yearFilter === "all" || user.year === yearFilter;
            const matchesType = typeFilter === "all" || user.type === typeFilter;

            return matchesSearch && matchesYear && matchesType;
        });

        setFilteredUsers(filteredUsers);


        // filterUsers();
    }, [users, searchQuery, yearFilter, typeFilter]);

    const handleAction = async (user: User, action: "promote" | "demote" | "remove" | 'accept') => {
        setSelectedUser(user);
        setActionType(action);
        setIsConfirmOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedUser || !actionType) return;

        setIsLoading(true);
        try {
            // Here you would make the API call to update the user's role
            const endpoint = `/api/admin/users/${actionType}`;
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: selectedUser.id })
            });

            if (!response.ok) {
                // const errorMessage = await response.text();
                toast.error(`Failed to update user`);
                // throw new Error("Failed to update");
                return;
            }

            // Update local state
            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.id !== selectedUser.id) return user;

                    let newType: UserType = user.type;
                    switch (actionType) {
                        case "promote":
                            newType = "admin";
                            break;
                        case "demote":
                            newType = "member";
                            break;
                        case "remove":
                            newType = "non-member";
                            break;
                        case "accept":
                            newType = 'member';
                            break;
                    }

                    return { ...user, type: newType };
                })
            );

            toast.success("User updated successfully");
        } catch (error) {
            toast.error("Failed to update user");
        } finally {
            setIsLoading(false);
            setIsConfirmOpen(false);
            setSelectedUser(null);
            setActionType(null);
        }
    };

    return (
        <InnerLayout>
            <Protected>
                <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background/80 p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="backdrop-blur-xl bg-background/60 border-muted/20 shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                            <Users className="h-6 w-6" />
                                            User Management
                                        </CardTitle>
                                        <CardDescription>
                                            Manage all users and their roles in the system
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Filters */}
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search by name, email, or registration number..."
                                                    className="pl-10"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <Select value={yearFilter} onValueChange={setYearFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Years</SelectItem>
                                                {["1st", "2nd", "3rd", "4th"].map((year) => (
                                                    <SelectItem key={year} value={year}>
                                                        {year} Year
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={typeFilter}
                                            onValueChange={(value) => setTypeFilter(value as UserType | "")}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="member">Member</SelectItem>
                                                <SelectItem value="non-member">Non-member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Loading State */}
                                    {isPageLoading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col items-center space-y-4"
                                            >
                                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                                <p className="text-muted-foreground">Loading users...</p>
                                            </motion.div>
                                        </div>
                                    ) : (
                                        /* Users Table */
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Registration No.</TableHead>
                                                        <TableHead>Year</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredUsers.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                                No users found matching your filters
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredUsers.map((user) => (
                                                            <TableRow key={user.id}>
                                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                                <TableCell>{user.email}</TableCell>
                                                                <TableCell>{user.regno}</TableCell>
                                                                <TableCell>{user.year}</TableCell>
                                                                <TableCell>
                                                                    <span
                                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.type === "admin"
                                                                            ? "bg-blue-100 text-blue-700"
                                                                            : user.type === "member"
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-gray-100 text-gray-700"
                                                                            }`}
                                                                    >
                                                                        {user.type}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm">
                                                                                Actions <ChevronDown className="ml-2 h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            {user.type !== "admin" && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleAction(user, "promote")}
                                                                                >
                                                                                    <Shield className="mr-2 h-4 w-4" />
                                                                                    Promote to Admin
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {user.type === "admin" && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleAction(user, "demote")}
                                                                                >
                                                                                    <ShieldOff className="mr-2 h-4 w-4" />
                                                                                    Demote to Member
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {user.type !== "non-member" && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleAction(user, "remove")}
                                                                                    className="text-destructive"
                                                                                >
                                                                                    <UserMinus className="mr-2 h-4 w-4" />
                                                                                    Remove from Members
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {!user.isMember && !user.isAdmin && (
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleAction(user, "accept")}
                                                                                >
                                                                                    <Shield className="mr-2 h-4 w-4" />
                                                                                    Accept as Member
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Confirmation Dialog */}
                    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {actionType === "promote" && "Are you sure you want to promote this user to admin?"}
                                    {actionType === "demote" && "Are you sure you want to demote this user to member?"}
                                    {actionType === "remove" && "Are you sure you want to remove this user from members?"}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmAction} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </Protected>
        </InnerLayout>
    );
}