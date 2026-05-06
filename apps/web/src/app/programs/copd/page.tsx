import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "COPD Remote Monitoring Program",
  description:
    "Priority Home Monitor's COPD program provides daily remote monitoring for patients with Chronic Obstructive Pulmonary Disease, helping prevent hospitalizations and keeping you breathing easier at home.",
};

const copdData = {
  programName: "COPD - Respiratory Care Program",
  description:
    "Chronic Obstructive Pulmonary Disease is manageable with the right daily support. Our remote monitoring program delivers clinical-grade oversight directly to your home so your care team can detect changes in your breathing before they become emergencies.",
  primaryCTA: "Refer a Patient",
  ctaHref: "/refer",
  secondaryCTA: "Purchase Device Bundle",
  secondaryCtaHref: "/shop",
  devices: ["Digital Peak Flow Meter", "Bluetooth Pulse Oximeter"],
  qualifyingConditions: [
    "Diagnosed with COPD, emphysema, or chronic bronchitis",
    "One or more COPD related hospitalizations in the past 12 months",
    "Current use of inhalers, nebulizers, or supplemental oxygen",
    "Frequent shortness of breath that limits daily activities",
    "Medicare or Medicaid insurance coverage as primary or supplemental",
    "Lives at home with or without a caregiver",
  ],
  steps: [
    "Your physician or our team submits a referral — takes less than 3 minutes.",
    "We ship a clinically validated pulse oximeter and spirometer directly to the patient's home.",
    "The patient records daily readings. Our care team reviews alerts and coordinates with the physician.",
  ],
  image1: "/PHM Program pictures/COPD_RESPIRATORY_CARE_1.png",
  image2: "/PHM Program pictures/COPD_RESPIRATORY_CARE_2.png",
};

export default function COPDPage() {
  return <ProgramPage {...copdData} />;
}
