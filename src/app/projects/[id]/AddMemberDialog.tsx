'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { MoreHorizontal, Check, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Project, Role } from "@prisma/client";

interface CustomUser {
    name: string;
    id: string;
    regno: number;
    avatar: string | null;
    leadProjects: {
        id: string;
    }[];
    roles: {
        projectId: string;
    }[];
}

interface ExtendedProject extends Project {
    members: Role[];
}

export default function AddMemberDialog({project, onClose}: {project: ExtendedProject | null, onClose?: () => void}) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<CustomUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: string }>(project?.members.reduce((acc:Record<string,string>, member) => {
        acc[member.userId] = member.name;
        return acc;
    }, {}) || {});
    const [submitting, setSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const roleOptions = [
        "Developer",
        "UI Designer",
        "Hardware Designer",
        "Researcher",
        "Member"
    ];

    const assignRole = (userId: string, role: string) => {
        // Update the user's role in the users array
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role } : user
        ));

        // Add the user to selectedUsers with the assigned role
        setSelectedUsers({
            ...selectedUsers,
            [userId]: role
        });
    };

    const removeSelection = (userId: string) => {
        const updatedSelections = { ...selectedUsers };
        delete updatedSelections[userId];
        setSelectedUsers(updatedSelections);
    };

    async function handleSubmit() {
        try{
            setSubmitting(true);
            if(!project) throw new Error('Unknown project');
            const res = await fetch(`/api/projects/${encodeURIComponent(project?.id)}/update/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    members: selectedUsers
                })
            });
            if(res.status == 500) throw new Error('Failed to add members');
            const data = await res.json();
            if(!res.ok) throw new Error(data.msg);
            toast.success('Members added successfully');

        }catch(err: any){
            console.error(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
            setSubmitting(false);
            if(onClose) onClose();
            setIsOpen(false);
        }
    }

    function handleOpenChange(isOpen: boolean) {
        if(isOpen) getUsers();
        setIsOpen(isOpen);
    }

    async function getUsers(){
        try {
            setLoading(true);
            const res = await fetch('/api/users');
            if (res.status == 500) throw new Error('Failed to fetch users');
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg);
            setUsers(data);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog onOpenChange={handleOpenChange} open={isOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <Plus className="h-4 w-4" />
                    Add Members
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                    <DialogDescription>
                        Team up with people to work and achieve on projects together!
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 h-96 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Selection</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Reg. No.</TableHead>
                                {/* <TableHead>Current Role</TableHead> */}
                                <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="w-full">
                                        <div className="w-full flex items-center justify-center">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    if (user.id === project?.leadId) return;
                                    return <TableRow key={user.id}>
                                        <TableCell>
                                            {selectedUsers[user.id] ? (
                                                <Badge
                                                    variant="outline"
                                                    className="flex items-center gap-1 bg-green-50"
                                                    onClick={() => removeSelection(user.id)}
                                                >
                                                    <Check className="h-3 w-3" />
                                                    {selectedUsers[user.id]}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="text-gray-400"
                                                >
                                                    None
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="flex items-center space-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar || ''} alt={user.name} />
                                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span>{user.name}</span>
                                        </TableCell>
                                        <TableCell>{user.regno}</TableCell>
                                        {/* <TableCell>{user.role}</TableCell> */}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {roleOptions.map((role) => (
                                                        <DropdownMenuItem
                                                            key={role}
                                                            onClick={() => assignRole(user.id, role)}
                                                        >
                                                            Appoint as {role}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
})
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant='default' onClick={() => handleSubmit()} disabled={submitting}>
                        Add Selected Members ({Object.keys(selectedUsers).length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}