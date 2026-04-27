import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Prepared Meal Program — Medically Tailored Meals via CookUnity",
  description:
    "Priority Home Monitor partners with CookUnity to deliver fresh, chef prepared, clinically appropriate meals directly to patients managing chronic conditions, supporting nutrition as a pillar of remote care.",
};

const data = {
  programName: "Prepared Meal Program (CookUnity)",
  description:
    "Nutrition is medicine. For patients managing chronic conditions like heart failure, diabetes, or kidney disease, what they eat between appointments matters as much as any prescription. Our partnership with CookUnity delivers fresh, chef prepared, nutritionist reviewed meals tailored to each patient's clinical needs shipped directly to their door every week.",
  primaryCTA: "Order Meals via CookUnity",
  ctaHref: "https://www.cookunity.com/business/priorityhomemonitor",
  externalCta: true,
  externalCta: true,
  qualifyingConditions: [
    "Managing a chronic condition with dietary restrictions such as low sodium for heart failure, carbohydrate controlled for diabetes, or renal diet for chronic kidney disease",
    "Physician or registered dietitian has identified nutritional deficiency or dietary non-compliance as a clinical concern",
    "Patient lives alone or has limited ability to prepare fresh, nutritionally appropriate meals independently",
    "Located in a CookUnity serviced ZIP code with coverage across most major U.S. metropolitan areas",
  ],
  steps: [
    "Your care coordinator or physician identifies the appropriate meal plan type based on your diagnosis.",
    "You select your weekly meal preferences on the CookUnity platform using fresh, chef cooked options with full nutritional labels.",
    "Meals arrive fresh each week. Your care team reviews adherence and coordinates dietary adjustments with your physician as needed.",
  ],
};

export default function MealsPage() {
  return <ProgramPage {...data} />;
}
