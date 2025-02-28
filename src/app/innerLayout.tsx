"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Users, FileText, Settings, UserCircle, MessageSquare, Calendar, Award, Notebook as Robot, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Applications", href: "/applications", icon: FileText },
    { name: "Members", href: "/admin/users", icon: Users },
    { name: "Community", href: "/community", icon: MessageSquare },
    // { name: "Events", href: "/dashboard/events", icon: Calendar },
    { name: "Projects", href: "/projects", icon: Robot },
    // { name: "Achievements", href: "/dashboard/achievements", icon: Award },
    // { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
    // { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function InnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background/80">
            {/* Mobile Navigation */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        className="lg:hidden fixed top-4 right-4 z-50"
                        size="icon"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <nav className="flex flex-col h-full bg-card/50 backdrop-blur-xl">
                        <div className="px-4 py-6">
                            <div className="flex items-center gap-2 mb-8">
                                <Robot className="h-8 w-8 text-primary" />
                                <h1 className="text-xl font-bold">RISC Robotics</h1>
                            </div>
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                                            pathname === item.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-primary/5"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Desktop Navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
                <motion.nav
                    initial={{ x: -64, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col flex-grow w-64 bg-card/50 backdrop-blur-xl border-r"
                >
                    <div className="px-4 py-6">
                        <div className="flex items-center gap-2 mb-8">
                            <Robot className="h-8 w-8 text-primary" />
                            <h1 className="text-xl font-bold">RISC Robotics</h1>
                        </div>
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        pathname === item.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-primary/5"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.nav>
            </div>

            {/* Main Content */}
            <main className="lg:pl-64">
                <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}