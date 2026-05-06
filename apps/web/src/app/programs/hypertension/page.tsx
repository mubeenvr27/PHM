import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Hypertension Remote Monitoring Program",
  description:
    "Priority Home Monitor's Hypertension program delivers daily blood pressure tracking and clinical oversight at home, helping patients and physicians stay ahead of dangerous readings.",
};

const data = {
  programName: "Hypertension Monitoring Program",
  description:
    "Uncontrolled high blood pressure is a leading cause of stroke, heart attack, and kidney disease yet most patients check their readings only a few times a year. Our remote monitoring program captures daily measurements and flags concerning trends to your care team in real time so action happens before a crisis does.",
  primaryCTA: "Enroll in Hypertension Care",
  ctaHref: "/contact",
  secondaryCTA: "Purchase Device Bundle",
  secondaryCtaHref: "/shop",
  devices: ["Bluetooth Blood Pressure Cuff", "Bluetooth Weight Scale"],
  qualifyingConditions: [
    "Diagnosed with Stage 1 or Stage 2 hypertension with blood pressure at or above 130/80 mmHg",
    "History of hypertension related hospitalization or ER visit in the past 12 months",
    "Currently prescribed one or more antihypertensive medications",
    "Medicare or Medicaid as primary or secondary insurance coverage",
  ],
  steps: [
    "Your physician or our intake team submits a brief referral completed in under 5 minutes.",
    "We ship a validated cellular connected blood pressure cuff directly to the patient's door at no out of pocket cost.",
    "Daily readings sync automatically. Our care coordinators review trends and alert your physician when intervention is needed.",
  ],
  image1: "/PHM Program pictures/HYPERTENSION_MONITORING_1.png",
  image2: "/PHM Program pictures/HYPERTENSION_MONITORING_2.png",
};

export default function HypertensionPage() {
  return <ProgramPage {...data} />;
}
