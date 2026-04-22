import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Diabetes Chronic Care Management (CCM) Program",
  description:
    "Priority Home Monitor's Diabetes CCM program delivers structured, physician guided remote monitoring for Type 1 and Type 2 diabetic patients, preventing complications through daily glucose oversight.",
};

const data = {
  programName: "Diabetes — Chronic Care Management",
  description:
    "Managing diabetes requires consistent daily attention that extends well beyond quarterly clinic visits. Our Chronic Care Management program pairs patients with a dedicated care coordinator and daily glucose monitoring to reduce A1C drift, prevent hypoglycemic episodes, and keep complications at bay.",
  primaryCTA: "Start Diabetes CCM Program",
  ctaHref: "/refer",
  qualifyingConditions: [
    "Diagnosed with Type 1 or Type 2 diabetes mellitus",
    "A1C above 8.0 percent at most recent lab draw or recurrent hypoglycemic episodes",
    "Currently prescribed insulin, metformin, or other glucose lowering medications",
    "Medicare or Medicaid beneficiary with at least two chronic conditions",
  ],
  steps: [
    "The referring physician completes a short enrollment form and provides a CCM care plan order.",
    "Our clinical team contacts the patient within 48 hours to ship a connected glucose monitor and complete initial onboarding.",
    "The patient logs daily readings and care coordinators provide monthly structured check-ins, relaying data to the physician.",
  ],
};

export default function DiabetesCCMPage() {
  return <ProgramPage {...data} />;
}
