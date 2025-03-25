"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Mail, ArrowRight } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real application, you would call an API endpoint to handle password reset
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md rounded-lg bg-[#1e293b] p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent border-2 border-[#3b82f6]">
            <HelpCircle className="h-6 w-6 text-[#3b82f6]" />
          </div>
        </div>

        <h1 className="mb-1 text-center text-3xl font-bold text-white">Reset Password</h1>
        <p className="mb-8 text-center text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-3 rounded relative mb-4" role="alert">
            <p className="font-bold">Email sent!</p>
            <p className="block sm:inline">Check your inbox for a password reset link.</p>
            <div className="mt-4 text-center">
              <Link href="/auth/signin" className="text-[#3b82f6] hover:text-[#2563eb]">
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-[#2d3748] border-0 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              disabled={isLoading}
            >
              <ArrowRight className="mr-2 h-4 w-4" /> 
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-[#3b82f6] hover:text-[#2563eb]">
                  Back to sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
