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
import { AlertCircle, ShieldCheck, Activity, KeyRound, Mail, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const ROLE_MAP: Record<string, AdminRole> = {
  "superadmin@phm.com": "superadmin",
  "admin@phm.com": "admin",
  "manager@phm.com": "manager",
  "user@phm.com": "user",
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
      const role = ROLE_MAP[values.email.toLowerCase()];

      if (role && values.password === MOCK_PASSWORD) {
        await setMockAdminCookie(role);
        router.push("/admin/products");
      } else {
        form.setError("root", {
          type: "manual",
          message:
            "Invalid credentials. Use one of the quick-login accounts below with password123.",
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

  // Quick-select login helper function
  const applyMockCredentials = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", MOCK_PASSWORD);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans">

      {/* ── LEFT PANEL: High-end Branding & Decorative Sidebar ── */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between bg-[#1B3A5C] p-12 text-white overflow-hidden shadow-2xl">
        {/* Modern radial highlight & mesh backdrop */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(13,115,119,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(30,77,117,0.8) 0%, transparent 70%)",
          }}
        />

        {/* Abstract floating card graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-10">
          <Activity className="w-full h-full text-white" strokeWidth={0.5} />
        </div>

        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <ShieldCheck className="h-6 w-6 text-[#6EE7E9]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">PHM Admin Portal</span>
        </div>

        {/* Dynamic marketing hook */}
        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-[#6EE7E9] backdrop-blur-md border border-teal-500/20">
            <Sparkles size={12} className="animate-pulse" /> Live Telemetry Dashboard
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-white">
            Secure Clinical Command Center
          </h2>
          <p className="text-base text-slate-300/90 leading-relaxed">
            Monitor real-time patient status, manage device inventory pipelines, and authorize coordinator permissions in a fully HIPAA-compliant workspace.
          </p>

          {/* Quick Stats list */}
          <ul className="space-y-3.5 pt-4">
            {[
              "Role-based privilege segregation (RBAC)",
              "Audit logging on all database actions",
              "Direct integration with provider networks",
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                <CheckCircle2 size={16} className="text-[#6EE7E9] shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} Priority Home Monitor Inc. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL: Interactive Form & Credential Helper ── */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 min-h-screen bg-[#F8FAFC]">
        <div className="w-full max-w-md space-y-8">

          {/* Logo & Mobile branding info */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Logo variant="horizontal" className="w-56 text-[#1B3A5C] hover:scale-105 transition-transform duration-300" />
            <div className="space-y-1.5 mt-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#1B3A5C]">
                Clinical Gateway
              </h1>
              <p className="text-sm text-slate-500">
                Authorized personnel only. Please submit your portal credentials.
              </p>
            </div>
          </div>

          {/* Core Login Card */}
          <Card className="border border-slate-200/60 bg-white shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {form.formState.errors.root && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-sm border border-red-100/80 animate-in fade-in duration-200">
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <p className="font-bold">Authentication Failed</p>
                        <p className="text-xs text-red-600/90 mt-0.5">{form.formState.errors.root.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-semibold text-slate-700">Email Address</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5.5 w-5.5 text-slate-400" />
                          <FormControl>
                            <Input
                              placeholder="e.g. admin@phm.com"
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              className="bg-slate-50/50 pl-11 h-12 rounded-xl border-slate-200 focus:border-[#0D7377] focus:ring-[#0D7377]/10 focus:bg-white transition-all text-sm"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Password Input */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-sm font-semibold text-slate-700">Password</FormLabel>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5.5 w-5.5 text-slate-400" />
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              autoComplete="current-password"
                              disabled={isLoading}
                              className="bg-slate-50/50 pl-11 h-12 rounded-xl border-slate-200 focus:border-[#0D7377] focus:ring-[#0D7377]/10 focus:bg-white transition-all text-sm"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#0D7377] hover:bg-[#0a5f63] h-12 rounded-xl text-base font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 justify-center">
                        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 justify-center">
                        <span>Authenticate</span>
                        <ArrowRight size={18} />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
