"use client";

import { useSession } from "next-auth/react";

export default function Footer() {
    const { data: session } = useSession();
    
    // Only show footer on authenticated pages
    if (!session) {
        return null;
    }
    
    return (
        <footer className="flex-shrink-0 border-t border-border bg-card p-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} UAV Telemetry System. All rights reserved.
        </footer>
    );
}
