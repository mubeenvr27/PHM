import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Heart Failure Chronic Care Management (CCM) Program",
  description:
    "Priority Home Monitor's Heart Failure CCM program uses daily weight and symptom monitoring to detect fluid retention early, reducing 30-day readmission rates for congestive heart failure patients.",
};

const data = {
  programName: "Heart Failure - Chronic Care Management",
  description:
    "Heart failure readmissions are often preventable. A one kilogram overnight weight gain can signal dangerous fluid buildup days before a patient feels breathless. Our program catches those changes early, giving your physician the window they need to adjust diuretics and keep patients out of the hospital.",
  primaryCTA: "Start Heart Failure Program",
  ctaHref: "/contact",
  secondaryCTA: "Purchase Device Bundle",
  secondaryCtaHref: "/shop",
  devices: ["4G Blood Pressure Cuff", "4G Weight Scale"],
  qualifyingConditions: [
    "Diagnosed with congestive heart failure in any stage",
    "One or more heart failure related hospitalizations within the past 12 months",
    "Currently prescribed diuretics, ACE inhibitors, beta blockers, or ARNI therapy",
    "Medicare or Medicaid beneficiary with two or more qualifying chronic conditions",
  ],
  steps: [
    "The cardiologist or hospitalist submits a referral at discharge or during an outpatient visit.",
    "We ship a cellular connected scale and symptom tracking tablet to the patient's home within 48 hours.",
    "The patient weighs in daily. Our care team reviews trends and escalates fluid gain alerts directly to the managing physician.",
  ],
  image1: "/PHM Program pictures/HEART_FAILURE_1.png",
  image2: "/PHM Program pictures/HEART_FAILURE_2.png",
};

export default function HeartFailureCCMPage() {
  return <ProgramPage {...data} />;
}
