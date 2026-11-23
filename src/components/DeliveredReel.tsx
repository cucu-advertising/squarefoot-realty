import Reel, { type ReelCard } from "./Reel";
import { getProject } from "@/lib/projects";

/** Delivered work as information cards in the horizontal reel (home page and projects page). */
export default function DeliveredReel({ id, intro }: { id?: string; intro: React.ReactNode }) {
  const cards: ReelCard[] = [
    { project: getProject("trans-elite")!, size: "x", caption: "Apartments · Adibatla, ORR Exit-12", info: ["2 & 3 BHK", "1,245 – 1,830 sft", "HMDA approved", "Beside the TCS campus"] },
    { project: getProject("challa-elite")!, size: "x", caption: "Apartments · Tukkuguda, ORR Exit-14", info: ["2 & 3 BHK", "1,150 – 1,895 sft", "HMDA approved"] },
    { project: getProject("trans-arcade")!, size: "x", caption: "Commercial · Adibatla, ORR Exit-12", info: ["Commercial spaces"] },
    { project: getProject("lokeshwari-residency")!, size: "x", caption: "Residential · Habsiguda, Hyderabad", info: ["Residential"] },
  ];
  return <Reel id={id} intro={intro} cards={cards} />;
}
