import ProjectRail from "./ProjectRail";
import { getProject } from "@/lib/projects";

/** The three current communities, in one sideways row (home page and projects page). */
export default function OurProjects({ id, label, title, curtain }: { id?: string; label: string; title: string; curtain?: boolean }) {
  const ranch = getProject("the-urban-ranch")!;
  const square = getProject("the-square")!;
  const origin = getProject("squarefoot-origin")!;
  return (
    <ProjectRail
      id={id}
      curtain={curtain}
      label={label}
      title={title}
      items={[
        { project: ranch, image: ranch.cover! },
        { project: square, image: { src: "/images/the-square/west-villa-aerial.jpg", width: 3840, height: 2160, alt: "West facing villa with terrace garden at The Square" } },
        { project: origin, image: { src: "/images/squarefoot-origin/east-row.jpg", width: 3840, height: 2160, alt: "Row of East facing villas at Squarefoot Origin" } },
      ]}
    />
  );
}
