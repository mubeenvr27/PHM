import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";

export const metadata: Metadata = {
  title: "ENT Sleep Program — Surgical Pre and Post Op Monitoring",
  description:
    "Priority Home Monitor's ENT Sleep program supports otolaryngologists with pre operative sleep assessment and post surgical compliance monitoring for patients undergoing airway procedures.",
};

const data = {
  programName: "ENT Sleep Program",
  description:
    "Ear, nose, and throat surgeons frequently operate on patients with underlying sleep disordered breathing. Our ENT Sleep program provides pre operative home sleep testing to stratify anesthetic risk and post operative monitoring to confirm surgical outcomes, delivered entirely without additional in office visits.",
  primaryCTA: "Enroll an ENT Patient",
  ctaHref: "/contact",
  qualifyingConditions: [
    "Scheduled for adenotonsillectomy, uvulopalatopharyngoplasty, or other upper airway surgical procedures",
    "Pre operative evaluation requiring sleep apnea risk stratification",
    "Post operative patient requiring OSA therapy compliance confirmation",
    "ENT or surgical specialist referral with a qualifying diagnosis code",
  ],
  steps: [
    "The ENT surgeon or their coordinator submits a pre op referral indicating the planned procedure and risk concerns.",
    "We ship a home sleep test device within 48 hours and completed results are returned to the surgeon before the procedure date.",
    "For post op patients, we provide 30 and 90 day monitoring check-ins and deliver a compliance report to confirm surgical outcomes.",
  ],
};

export default function ENTSleepPage() {
  return <ProgramPage {...data} />;
}
