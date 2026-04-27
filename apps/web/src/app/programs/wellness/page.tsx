import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Wellness Program — Mental, Nutrition and Weight Management",
  description:
    "Priority Home Monitor's Wellness program connects patients with care coordinators and behavioral health tools to address mental well being, nutritional habits, and medically supervised weight management.",
};

const data = {
  programName: "Wellness: Mental, Nutrition and Weight",
  description:
    "Physical conditions rarely exist in isolation. Our Wellness program takes an integrative approach, addressing the mental health, nutritional, and weight management factors that directly drive chronic disease outcomes. Care coordinators work with patients between physician visits to build sustainable habits and reduce clinical risk.",
  primaryCTA: "Start Wellness Program",
  ctaHref: "/contact",
  qualifyingConditions: [
    "BMI at or above 30, or BMI at or above 27 with one or more weight related comorbidities such as Type 2 diabetes or hypertension",
    "Diagnosed with anxiety, depression, or a stress related condition impacting chronic disease management",
    "Patient or physician identified nutritional deficiencies contributing to poor health outcomes",
    "Medicare or Medicaid beneficiary with a qualifying behavioral health or obesity related diagnosis",
  ],
  steps: [
    "The referring physician submits a wellness referral with relevant diagnosis codes and a brief clinical summary.",
    "A care coordinator schedules an initial 30 minute onboarding call to complete a wellness assessment and set personal goals.",
    "Monthly structured check-ins track progress. Behavioral health resources, nutrition guides, and physician updates are shared throughout.",
  ],
};

export default function WellnessPage() {
  return <ProgramPage {...data} />;
}
