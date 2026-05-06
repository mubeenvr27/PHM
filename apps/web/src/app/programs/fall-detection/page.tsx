import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Fall Detection and Safety Monitoring Program",
  description:
    "Priority Home Monitor's Fall Detection program uses wearable sensor technology to detect falls in real time and alert caregivers and care teams, protecting high risk patients living independently at home.",
};

const data = {
  programName: "Fall Detection - Safety and Monitoring",
  description:
    "Falls are the leading cause of injury related death among adults over 65 and most happen at home. Our Fall Detection program equips patients with clinically validated wearable sensors that automatically detect a fall and immediately notify caregivers and our 24/7 care coordination team, ensuring help arrives without delay.",
  primaryCTA: "Enroll in Fall Protection",
  ctaHref: "/contact",
  qualifyingConditions: [
    "History of one or more falls in the past 12 months with or without injury",
    "Gait abnormality, lower extremity weakness, or balance disorder documented by a physician",
    "Taking four or more medications including high fall risk drugs such as benzodiazepines, diuretics, or antihypertensives",
    "Medicare or Medicaid beneficiary living independently or with a part time caregiver",
  ],
  steps: [
    "The primary care physician or geriatrist completes a brief fall risk referral form identifying the patient's risk factors.",
    "We ship a lightweight, waterproof fall detection wearable and program the emergency contact list during a setup call with the patient.",
    "In the event of a fall, our care team is alerted within seconds and contacts the patient, caregiver, and physician per the established escalation protocol.",
  ],
  image1: "/PHM Program pictures/fall_detection_pic1.png",
  image2: "/PHM Program pictures/fall_detection_pic2.png",
};

export default function FallDetectionPage() {
  return <ProgramPage {...data} />;
}
