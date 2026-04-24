"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, CheckCircle2, Check, ChevronsUpDown, Mail, MapPin, Phone, X } from "lucide-react"

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
const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  programInterest: z.array(z.string()).optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

/* ─── Page ──────────────────────────────────────────────────── */
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      programInterest: [],
      message: "",
    },
  })

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log("Form submitted:", data)
      form.reset()
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Header Banner ── */}
      <section className="bg-[#1B3A5C] py-16 lg:py-24">
        <div className="mx-auto w-full px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-white/80">
            We are here to answer your questions and help you get started with remote monitoring.
          </p>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto w-full px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">

            {/* ── Left Column (Dark Form Card) ── */}
            <div className="rounded-2xl bg-[#1B3A5C] p-8 shadow-xl md:p-10">
              <h2 className="mb-6 text-2xl font-bold text-white">Send us a message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            id="contact-fullname"
                            placeholder="John Doe"
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
                        <FormLabel className="text-white">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            id="contact-phone"
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
                        <FormLabel className="text-white">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            id="contact-email"
                            placeholder="john@example.com"
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
                                id="contact-program-interest"
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

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            id="contact-message"
                            placeholder="How can we help you?"
                            className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60"
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
                    id="contact-submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0D7377] hover:bg-[#0D7377]/90 text-white h-12 text-base font-semibold"
                  >
                    {isSubmitting ? "Submitting..." : "Request a Consultation"}
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
                    Prompt response from our dedicated clinical intake team within 24 hours.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0D7377]" />
                  <span className="text-[#1B3A5C]/80">
                    Consultation to evaluate your specific clinical needs and monitoring goals.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0D7377]" />
                  <span className="text-[#1B3A5C]/80">
                    Clear explanation of how Medicare and Medicaid cover our remote monitoring services.
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
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Phone</p>
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
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Email</p>
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
                    <p className="text-sm font-medium text-[#1B3A5C]/60">Location</p>
                    <p className="font-semibold text-[#1B3A5C]">Waxahachie, TX, USA</p>
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
