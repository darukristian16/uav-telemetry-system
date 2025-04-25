"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming Button has necessary variants/styling capabilities
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox can be styled
import { Input } from "@/components/ui/input"; // Assuming Input can be styled
import { HelpCircle, Mail, Lock, ArrowRight } from "lucide-react";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa"; // Using react-icons for social logos

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // More specific errors can be handled here based on result.error value
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Redirect on success
      router.push("/dashboard"); // Or wherever you want to redirect after login
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    // Main container: Dark background, centered content
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-4 text-gray-200">
      {/* Login Card */}
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
        {/* Top Icon */}
        <div className="mb-6 flex justify-center">
          {/* Using text color for the icon directly */}
          <HelpCircle className="h-12 w-12 text-blue-500" />
        </div>

        {/* Headings */}
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          Sign in to your UAV Telemetry System
        </p>

        {/* Registration Sucess Message */}
        {registered && (
           <div className="mb-4 rounded border border-blue-500 bg-blue-900/50 px-4 py-3 text-sm text-blue-200" role="alert">
             <span className="block sm:inline">Registration successful! Please sign in.</span>
           </div>
         )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded border border-red-500 bg-red-900/50 px-4 py-3 text-sm text-red-200" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              {/* Assuming Input component accepts className for styling */}
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-600 bg-gray-700 pl-10 pr-3 py-2 text-white placeholder-gray-500 transition duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6"> {/* Increased margin bottom */}
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                 className="w-full rounded-md border border-gray-600 bg-gray-700 pl-10 pr-3 py-2 text-white placeholder-gray-500 transition duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
               {/* Assuming Checkbox component accepts className for styling */}
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="h-4 w-4 cursor-pointer rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                aria-label="Remember me"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 cursor-pointer text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>
            <div>
              <Link
                href="/auth/forgot-password" // Make sure this path is correct
                className="text-sm text-blue-500 hover:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Sign In Button */}
          {/* Assuming Button component accepts className and can handle disabled state styling */}
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
            disabled={isLoading}
          >
            <ArrowRight className="h-5 w-5" />
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

{/* Divider */}
<div className="relative my-8"> {/* Adjusted margin */}
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
             {/* Slightly darker/subtler border for the line */}
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center">
             {/* Ensure this background matches the card's bg-gray-800 */}
            <span className="bg-gray-800 px-3 text-sm text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Logins - Grid Layout */}
        {/* Container now uses grid to distribute buttons across the full width */}
        <div className="mb-8 grid grid-cols-3 gap-4"> {/* Key change: grid grid-cols-3 */}

          {/* Google Button */}
          <Button
            type="button"
            aria-label="Sign in with Google"
            className="
              flex h-10 items-center justify-center rounded-md   /* Height + Centering */
              border border-gray-600 bg-gray-700                 /* Colors & Border */
              text-gray-300                                       /* Icon Color */
              transition duration-200
              hover:border-gray-500 hover:bg-gray-600             /* Hover */
              focus:outline-none focus:ring-2 focus:ring-blue-500 /* Focus */
              focus:ring-offset-2 focus:ring-offset-gray-800
              /* NO w-* class needed, the grid column handles width */
            "
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FaGoogle className="h-5 w-5" />
          </Button>

          {/* Github Button - Apply identical classes */}
          <Button
            type="button"
            aria-label="Sign in with Github"
            className="
              flex h-10 items-center justify-center rounded-md
              border border-gray-600 bg-gray-700
              text-gray-300
              transition duration-200
              hover:border-gray-500 hover:bg-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:ring-offset-2 focus:ring-offset-gray-800
            "
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            <FaGithub className="h-5 w-5" />
          </Button>

          {/* Microsoft Button - Apply identical classes */}
          <Button
            type="button"
            aria-label="Sign in with Microsoft"
            className="
              flex h-10 items-center justify-center rounded-md
              border border-gray-600 bg-gray-700
              text-gray-300
              transition duration-200
              hover:border-gray-500 hover:bg-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:ring-offset-2 focus:ring-offset-gray-800
            "
            onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
          >
            <FaMicrosoft className="h-5 w-5" />
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/auth/signup" // Make sure this path is correct
            className="font-medium text-blue-500 hover:text-blue-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
