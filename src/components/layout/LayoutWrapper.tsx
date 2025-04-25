"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth/');

  if (isAuthPage) {
    // Use the auth-layout class for auth pages
    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    );
  }

  // Use dashboard-layout classes for non-auth pages
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Only this main element should be scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
