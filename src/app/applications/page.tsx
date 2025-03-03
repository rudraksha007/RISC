"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Filter, ArrowDown, ArrowUp, CheckCircle, XCircle, MoreHorizontal, Clock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import InnerLayout from "../innerLayout";
import { Application, ApplicationStatus } from "@prisma/client";

export default function ApplicationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [applicationsData, setApplicationsData] = useState<Application[]|[]>([]);

    useEffect(()=>{
        async function fetchData(){
            const data = await fetch('/api/applications');
            const applications = await data.json();
            setApplicationsData(applications);
            console.log(applications);
        }
        fetchData();

    }, []);
    // Handle sorting
    const requestSort = (key: any) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sorted and filtered applications
    const getSortedApplications = () => {
        let filteredItems = applicationsData.filter(app => {
            const matchesSearch =
            //@ts-ignore
                app.author.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.regNo.toLowerCase().includes(searchQuery.toLowerCase()) || app.type.toLowerCase().includes(searchQuery.toLowerCase());

            if (activeTab === "all") return matchesSearch;
            if (activeTab === "pending") return matchesSearch && app.status === ApplicationStatus.PENDING;
            if (activeTab === "approved") return matchesSearch && app.status === ApplicationStatus.APPROVED;
            if (activeTab === "rejected") return matchesSearch && app.status === ApplicationStatus.REJECTED;

            return matchesSearch;
        });

        if (sortConfig.key) {
            filteredItems.sort((a, b) => {
                if (sortConfig.key && a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (sortConfig.key && a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredItems;
    };

    const sortedApplications = getSortedApplications();

    // Get status badge styling
    const getStatusBadge = (status: any) => {
        switch (status) {
            case "pending":
                return {
                    component: <Clock className="h-4 w-4" />,
                    class: "bg-amber-100 text-amber-800"
                };
            case "approved":
                return {
                    component: <CheckCircle className="h-4 w-4" />,
                    class: "bg-green-100 text-green-800"
                };
            case "rejected":
                return {
                    component: <XCircle className="h-4 w-4" />,
                    class: "bg-red-100 text-red-800"
                };
            default:
                return {
                    component: <Clock className="h-4 w-4" />,
                    class: "bg-gray-100 text-gray-800"
                };
        }
    };

    // Render sort indicator
    const renderSortIndicator = (key: any) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'asc' ?
            <ArrowUp className="h-4 w-4 ml-1" /> :
            <ArrowDown className="h-4 w-4 ml-1" />;
    };

    return (
        <InnerLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Applications</h1>
                        <p className="text-muted-foreground">
                            Manage and review pending applications
                        </p>
                    </div>
                    <Button variant="outline">
                        Export Data
                        <FileText className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Applications</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="approved">Approved</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex w-full sm:w-auto gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or reg. no..."
                                className="pl-8 w-full sm:w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter By Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Project Membership</DropdownMenuItem>
                                <DropdownMenuItem>Club Membership</DropdownMenuItem>
                                <DropdownMenuItem>Event Participation</DropdownMenuItem>
                                <DropdownMenuItem>Project Lead</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-0">
                        <CardTitle>Application List</CardTitle>
                        <CardDescription>
                            Total: {sortedApplications.length} applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Applicant Name
                                                {renderSortIndicator('name')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort('regNo')}
                                        >
                                            <div className="flex items-center">
                                                Reg. No.
                                                {renderSortIndicator('regNo')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort('type')}
                                        >
                                            <div className="flex items-center">
                                                Type
                                                {renderSortIndicator('type')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort('submittedOn')}
                                        >
                                            <div className="flex items-center">
                                                Submitted On
                                                {renderSortIndicator('submittedOn')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => requestSort('status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {renderSortIndicator('status')}
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedApplications.map((application) => {
                                        const statusBadge = getStatusBadge(application.status);
                                        return (
                                            <TableRow key={application.id}>
                                                {/**@ts-ignore */}
                                                <TableCell className="font-medium">{application.author?.name}</TableCell>
                                                {/**@ts-ignore */}
                                                <TableCell>{application.author?.regno}</TableCell>
                                                <TableCell>{application.applicationType}</TableCell>
                                                <TableCell>{application.createdAt.toString().split('T')[0]}</TableCell>
                                                <TableCell>
                                                    <Badge className={statusBadge.class}>
                                                        <span className="flex items-center gap-1">
                                                            {statusBadge.component}
                                                            <span className="capitalize">{application.status}</span>
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline">
                                                            View
                                                        </Button>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="text-green-600">
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600">
                                                                    <XCircle className="h-4 w-4 mr-2" />
                                                                    Reject
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>Request More Info</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {sortedApplications.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-10">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-medium mb-2">No applications found</h3>
                                <p className="text-muted-foreground text-center max-w-md">
                                    {searchQuery
                                        ? "No applications match your search criteria. Try different keywords or clear your filters."
                                        : "There are no applications to display at the moment."}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </InnerLayout>
    );
}