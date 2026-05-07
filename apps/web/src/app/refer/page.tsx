"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, CheckCircle2, Check, ChevronsUpDown, Phone, Mail, MapPin, X, FileDown, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/* ─── Data ─────────────────────────────────────────────────── */
const PHM_PROGRAMS = [
  "COPD (Chronic Obstructive Pulmonary Disease)",
  "Heart Failure",
  "Diabetes",
  "Hypertension",
  "Obstructive Sleep Apnea",
  "Adult Sleep",
  "Pediatric Sleep",
  "ENT Sleep",
  "Mental Health",
  "Nutrition & Weight",
  "Fall Detection",
] as const

/* ─── Schema ────────────────────────────────────────────────── */
const referFormSchema = z.object({
  patientName:     z.string().min(2, { message: "Patient Name must be at least 2 characters." }),
  providerName:    z.string().min(2, { message: "Provider Name must be at least 2 characters." }),
  phone:           z.string().min(1, { message: "Phone number is required." }),
  email:           z.string().email({ message: "Please enter a valid email address." }),
  programInterest: z.array(z.string()).min(1, { message: "Please select at least one program." }),
  notes:           z.string().optional(),
})

type ReferFormValues = z.infer<typeof referFormSchema>

/* ─── Page ──────────────────────────────────────────────────── */
export default function ReferPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<ReferFormValues>({
    resolver: zodResolver(referFormSchema),
    defaultValues: {
      patientName:     "",
      providerName:    "",
      phone:           "",
      email:           "",
      programInterest: [],
      notes:           "",
    },
  })

  async function onSubmit(data: ReferFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/refer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        // Show success animation
        setShowSuccess(true)
        
        // Show toast notification
        toast.success("Referral submitted successfully!", {
          description: "Our intake team will contact the patient within 24 hours.",
          duration: 5000,
        })

        // Reset form
        form.reset()

        // Hide success animation after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      } else {
        toast.error("Failed to submit referral", {
          description: result.message || "Please try again later.",
        })
      }
    } catch (error) {
      console.error("Error submitting referral:", error)
      toast.error("An error occurred", {
        description: "Please try again or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Header Banner ── */}
      <section className="bg-[#1B3A5C] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl w-full px-6 text-center md:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Refer a Patient
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Partner with Priority Home Monitor to extend care directly into your patients' homes.
          </p>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl w-full px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">

            {/* ── Left Column (Dark Form Card) ── */}
            <div className="rounded-2xl bg-[#1B3A5C] p-8 shadow-xl md:p-10 relative overflow-hidden">
              {/* Success Overlay */}
              {showSuccess && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0D7377] animate-in fade-in zoom-in duration-500">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 animate-in zoom-in duration-700">
                      <CheckCircle2 className="h-12 w-12 text-white animate-in zoom-in duration-1000" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white animate-in slide-in-from-bottom-4 duration-700">
                      Referral Submitted!
                    </h3>
                    <p className="text-white/90 animate-in slide-in-from-bottom-4 duration-700 delay-100">
                      We'll contact the patient within 24 hours
                    </p>
                    <div className="mt-6 flex justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-white/60 animate-pulse" />
                      <Sparkles className="h-5 w-5 text-white/80 animate-pulse delay-150" />
                      <Sparkles className="h-5 w-5 text-white/60 animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              )}
              
              <h2 className="mb-6 text-2xl font-bold text-white">Patient Referral Form</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* Patient Name */}
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Patient Name</FormLabel>
                        <FormControl>
                          <Input
                            id="refer-patient-name"
                            placeholder="John Doe"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  {/* Provider Name */}
                  <FormField
                    control={form.control}
                    name="providerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Referring Provider / Clinic Name</FormLabel>
                        <FormControl>
                          <Input
                            id="refer-provider-name"
                            placeholder="Dr. Smith / Texas Health Clinic"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Contact Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            id="refer-phone"
                            placeholder="(555) 123 4567"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Contact Email Address</FormLabel>
                        <FormControl>
                          <Input
                            id="refer-email"
                            placeholder="clinic@example.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  {/* Program Interest Multi-Select */}
                  <FormField
                    control={form.control}
                    name="programInterest"
                    render={({ field }) => {
                      const selected: string[] = field.value ?? []

                      function toggle(program: string) {
                        const next = selected.includes(program)
                          ? selected.filter((p) => p !== program)
                          : [...selected, program]
                        field.onChange(next)
                      }

                      function remove(program: string, e: React.MouseEvent) {
                        e.stopPropagation()
                        field.onChange(selected.filter((p) => p !== program))
                      }

                      return (
                        <FormItem>
                          <FormLabel className="text-white">Program Interest</FormLabel>
                          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                              <button
                                id="refer-program-interest"
                                type="button"
                                aria-label="Select programs of interest"
                                className={cn(
                                  "flex min-h-[40px] w-full flex-wrap items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-left",
                                  "focus:outline-none focus:border-white/60",
                                  selected.length === 0 && "text-white/40"
                                )}
                              >
                                {selected.length === 0 ? (
                                  <span>Select programs of interest...</span>
                                ) : (
                                  selected.map((prog) => (
                                    <Badge
                                      key={prog}
                                      variant="secondary"
                                      className="flex items-center gap-1 bg-[#0D7377]/80 text-white hover:bg-[#0D7377] text-xs"
                                    >
                                      {prog}
                                      <span
                                        role="button"
                                        aria-label={`Remove ${prog}`}
                                        onClick={(e) => remove(prog, e)}
                                        className="cursor-pointer"
                                      >
                                        <X className="h-3 w-3" />
                                      </span>
                                    </Badge>
                                  ))
                                )}
                                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-white/50" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[var(--radix-popover-trigger-width)] p-0 border-slate-200 shadow-xl"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Search programs..." />
                                <CommandList>
                                  <CommandEmpty>No programs found.</CommandEmpty>
                                  <CommandGroup>
                                    {PHM_PROGRAMS.map((program) => {
                                      const isSelected = selected.includes(program)
                                      return (
                                        <CommandItem
                                          key={program}
                                          value={program}
                                          onSelect={() => toggle(program)}
                                          className="cursor-pointer"
                                        >
                                          <div className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded border border-slate-400",
                                            isSelected ? "bg-[#0D7377] border-[#0D7377]" : "opacity-50"
                                          )}>
                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                          </div>
                                          {program}
                                        </CommandItem>
                                      )
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )
                    }}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            id="refer-notes"
                            placeholder="Any context regarding the patient's condition?"
                            className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button
                    type="submit"
                    id="refer-submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0D7377] hover:bg-[#0D7377]/90 text-white h-12 text-base font-semibold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Referral"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>

                </form>
              </Form>
            </div>

            {/* ── Right Column (Expectations & Info) ── */}
            <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10 border border-[#E2EBF4]">
              <h3 className="mb-6 text-2xl font-bold text-[#1B3A5C]">What to expect</h3>
              <ul className="mb-10 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0D7377]" />
                  <span className="text-[#1B3A5C]/80">
                    Seamless integration with your existing clinical workflows without additional administrative overhead.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0D7377]" />
                  <span className="text-[#1B3A5C]/80">
                    Our intake team contacts the patient within 24 hours to confirm eligibility and initiate onboarding.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0D7377]" />
                  <span className="text-[#1B3A5C]/80">
                    You receive automated, actionable reports rather than raw, overwhelming patient data.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0D7377]" />
                  <span className="text-[#1B3A5C]/80">
                    Turnkey fulfillment: we ship FDA-cleared devices directly to your patients at no cost to your clinic.
                  </span>
                </li>
              </ul>

              <h3 className="mb-6 text-xl font-bold text-[#1B3A5C]">Direct Contact Info</h3>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#0D7377]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Provider Support Hotline</p>
                    <a href="tel:+19725734015" className="font-semibold text-[#1B3A5C] hover:text-[#0D7377]">
                      +1 972 573 4015
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#0D7377]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Referral Email</p>
                    <a href="mailto:priorityhomemonitor@gmail.com" className="font-semibold text-[#1B3A5C] hover:text-[#0D7377]">
                      priorityhomemonitor@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#0D7377]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Headquarters</p>
                    <p className="font-semibold text-[#1B3A5C]">Waxahachie, TX, USA</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#0D7377]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Social</p>
                    <a href="https://www.instagram.com/priority_home_monitor?igsh=MXZoYnJqMnd4MDk=" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1B3A5C] hover:text-[#0D7377]">
                      @priority_home_monitor
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#0D7377]">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Resources</p>
                    <a href="/PRIORITY%20HOME%20LEAFLET.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1B3A5C] hover:text-[#0D7377]">
                      Download Program Flyer
                    </a>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
