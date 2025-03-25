"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="bg-white shadow rounded-lg mb-6">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">UAV Telemetry Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </p>
          </div>
        </header>
        
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="rounded-lg border-4 border-dashed border-gray-200 p-4 min-h-96">
                <h2 className="text-xl font-semibold mb-4">Your Telemetry Data</h2>
                
                {session?.user?.role === "ADMIN" ? (
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-blue-700">You have admin access to all telemetry data.</p>
                  </div>
                ) : null}
                
                <p className="text-gray-600">
                  This is where your UAV telemetry data will be displayed. The dashboard is currently under development.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
