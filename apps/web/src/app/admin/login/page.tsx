"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setMockAdminCookie, type AdminRole } from "./actions";
import Logo from "@/components/ui/Logo";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";

// ── RBAC credential map ───────────────────────────────────────────────
// Each email maps to a specific role value that gets written to the
// mock_admin_token cookie. Page-level guards read this value directly.
//
// TODO: Replace this entire map with AWS Cognito signIn() when provisioned.
// The role will come from the verified ID token's custom:role claim.
const ROLE_MAP: Record<string, AdminRole> = {
  "superadmin@phm.com": "superadmin",
  "admin@phm.com":      "admin",
  "manager@phm.com":    "manager",
  "user@phm.com":       "user",
};

const MOCK_PASSWORD = "password123";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    form.clearErrors("root");

    try {
      /* ======================================================================
         TODO: AWS AMPLIFY COGNITO INTEGRATION
         ======================================================================
         Replace the mock logic below with actual AWS Amplify Auth:

         import { signIn } from 'aws-amplify/auth';

         const { isSignedIn } = await signIn({
           username: values.email,
           password: values.password,
         });

         If isSignedIn, decode the Cognito ID token to extract custom:role,
         then call setMockAdminCookie(role) to persist it, or rely entirely
         on the Cognito session cookie (no mock cookie needed at that point).
         ====================================================================== */

      const role = ROLE_MAP[values.email.toLowerCase()];

      if (role && values.password === MOCK_PASSWORD) {
        // Write the role value into the cookie so middleware + page guards can read it
        await setMockAdminCookie(role);
        router.push("/admin/products");
      } else {
        form.setError("root", {
          type: "manual",
          message:
            "Invalid credentials. Use [role]@phm.com and password123.",
        });
      }
    } catch {
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-4 flex flex-col items-center pt-8 pb-6">
          <Logo variant="horizontal" className="w-48 mb-4 text-[#1B3A5C]" />
          <div className="text-center space-y-1.5">
            <CardTitle className="text-2xl font-bold text-[#1B3A5C]">Admin Login</CardTitle>
            <CardDescription>
              Sign in with your assigned role credentials.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {form.formState.errors.root && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2 text-sm border border-red-100">
                  <AlertCircle size={16} />
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="superadmin@phm.com"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#0D7377] hover:bg-[#0a5f63] h-11 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
