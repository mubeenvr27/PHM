import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "Pediatric Sleep Monitoring Program",
  description:
    "Priority Home Monitor's Pediatric Sleep program provides at home overnight monitoring for children with suspected or diagnosed sleep disordered breathing, delivering clinical insights without overnight hospital stays.",
};

const data = {
  programName: "Pediatric Sleep Monitoring Program",
  description:
    "Children with untreated sleep disordered breathing can face academic difficulties, behavioral challenges, and long term cardiovascular effects. Our pediatric program allows families to complete overnight monitoring at home, with results reviewed by board-certified sleep physicians and coordinated directly with the child's pediatrician.",
  primaryCTA: "Refer a Pediatric Patient",
  ctaHref: "/refer",
  qualifyingConditions: [
    "Child between ages 2 and 17 with suspected sleep apnea, snoring, or witnessed pauses in breathing during sleep",
    "Referral from a pediatrician, ENT, or pulmonologist for a home sleep assessment",
    "History of adenotonsillectomy with persistent post operative sleep symptoms",
    "Medicaid, CHIP, or commercial insurance with a pediatric sleep disorder diagnosis",
  ],
  steps: [
    "The referring pediatrician or specialist completes a short referral and orders the home sleep assessment.",
    "We ship a child appropriate, FDA cleared overnight monitoring device directly to the family along with a setup video guide.",
    "The recorded data is interpreted by a board certified sleep physician within 72 hours, and a full report is sent to the referring provider.",
  ],
  image1: "/PHM Program pictures/PEADS_SLEEP_1.png",
  image2: "/PHM Program pictures/Peades_sleep_2.png",
};

export default function PediatricSleepPage() {
  return <ProgramPage {...data} />;
}
