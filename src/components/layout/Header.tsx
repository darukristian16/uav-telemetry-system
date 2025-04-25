"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle, User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 min-h-[4rem] items-center justify-between border-b border-border bg-card px-6 text-card-foreground">
      {/* Left Side - Logo/Title */}
      <Link href="/dashboard" className="flex items-center gap-3">
        <HelpCircle className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">UAV Telemetry System</span>
      </Link>

      {/* Right Side - User Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-5 w-5" />
          <span>{session?.user?.name || session?.user?.email || 'Guest User'}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 bg-secondary px-3 py-1.5 text-secondary-foreground hover:bg-secondary/80"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
