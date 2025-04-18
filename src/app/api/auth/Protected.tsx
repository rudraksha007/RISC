'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Protected({ children}: { children: React.ReactNode}) {
    const session = useSession();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function authenticate() {
            if (session.status === 'loading') {
                return; 
            }
            const data = await (await fetch("/api/auth/isAdmin")).json();
            if(!data.isAdmin){
                router.push('/dashboard');
                toast.error("You are not authorized to view this page", {
                    position: "top-right",
                });
            }else setIsAuthenticated(true)
        }
        authenticate();

    }, [session, router]);

    // Only render children when authenticated
    return isAuthenticated ? children : <>Please Wait While We Are Authenticating </>;
}