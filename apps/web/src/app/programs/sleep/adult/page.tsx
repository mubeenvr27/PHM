import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Adult Sleep Monitoring Program",
  description:
    "Priority Home Monitor's Adult Sleep program offers convenient home sleep testing and ongoing CPAP/therapy support for adults with sleep-disordered breathing — avoiding costly overnight lab stays.",
};

const data = {
  programName: "Adult Sleep Monitoring Program",
  description:
    "Nearly 80% of moderate-to-severe sleep apnea cases remain undiagnosed in adults. Our home sleep testing program makes diagnosis accessible — no overnight lab stay required. From initial assessment through therapy initiation, our clinical team manages the entire pathway alongside your physician.",
  primaryCTA: "Start Adult Sleep Program",
  ctaHref: "/refer",
  qualifyingConditions: [
    "Adult (18+) presenting with loud snoring, observed apnea events, or excessive daytime sleepiness",
    "Epworth Sleepiness Scale score ≥ 10 or STOP-BANG questionnaire indicating elevated risk",
    "No severe comorbidities that require in-lab polysomnography (e.g., severe COPD, complex cardiac arrhythmia)",
    "Medicare, Medicaid, or commercial insurance with an active physician referral",
  ],
  steps: [
    "Your primary care physician or specialist submits a referral and completes the home sleep test order.",
    "We mail a WatchPAT or equivalent FDA-cleared home sleep testing device with prepaid return shipping.",
    "Results are scored and interpreted within 72 hours. Therapy recommendations and a full report are sent directly to the referring physician.",
  ],
};

export default function AdultSleepPage() {
  return <ProgramPage {...data} />;
}
