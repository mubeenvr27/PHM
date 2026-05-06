import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Obstructive Sleep Apnea (OSA) Remote Monitoring Program",
  description:
    "Priority Home Monitor's OSA program supports CPAP compliance, tracks therapy data remotely, and coordinates care between sleep specialists and primary physicians to improve patient outcomes.",
};

const data = {
  programName: "Obstructive Sleep Apnea Program",
  description:
    "Untreated sleep apnea dramatically increases the risk of hypertension, stroke, and cardiac events yet CPAP adherence remains below 50 percent nationally. Our remote monitoring program tracks nightly therapy data, identifies compliance barriers early, and keeps your care team informed without requiring additional office visits.",
  primaryCTA: "Enroll in OSA Monitoring",
  ctaHref: "/contact",
  qualifyingConditions: [
    "Diagnosed with mild, moderate, or severe obstructive sleep apnea via sleep study",
    "Prescribed CPAP, BiPAP, or APAP therapy within the last 90 days or currently on therapy",
    "Experiencing daytime sleepiness, morning headaches, or witnessed apnea episodes",
    "Medicare or Medicaid coverage with a qualifying sleep disorder diagnosis code",
  ],
  steps: [
    "The sleep physician or pulmonologist submits a referral with the patient's sleep study results.",
    "Our respiratory therapist contacts the patient to review CPAP settings and ship any replacement supplies.",
    "Nightly compliance data is reviewed weekly. Non-adherent patients receive a proactive check-in call from our clinical team.",
  ],
  image1: "/PHM Program pictures/OBSTRUCTIVE SLEEP APNEA_1.png",
  image2: "/PHM Program pictures/OBSTRUCTIVE SLEEP_APNEA _2.png",
};

export default function OSAPage() {
  return <ProgramPage {...data} />;
}
