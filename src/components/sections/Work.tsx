import { useRef, type CSSProperties } from "react";
import { useGSAP } from "../../lib/useGSAP";
import { gsap } from "../../lib/smoothScroll";
import {
  useCoarsePointer,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../../lib/hooks";

type IconKind = "pharma" | "devops" | "health" | "eco" | "lens" | "voice" | "study" | "collab";

type Project = {
  index: string;
  title: string;
  category: string;
  stack: string;
  blurb: string;
  year: string;
  tint: string;
  surface: string;
  icon: IconKind;
};

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Zeux LifeSciences",
    category: "E-Com Pharma Mexico",
    stack: "MongoDB · Express · React · Node.js",
    blurb:
      "Full-stack pharmaceutical e-commerce platform delivering certified medical supplies across Mexico, featuring live catalog search and secure checkout.",
    year: "2026",
    tint: "#ece8df",
    surface:
      "radial-gradient(120% 90% at 20% 15%, #232220 0%, #0e0d0c 55%), linear-gradient(135deg, #171614, #0a0908)",
    icon: "pharma",
  },
  {
    index: "02",
    title: "OpsFlow DevOps Suite",
    category: "DevOps & Cloud Automation",
    stack: "MongoDB · Express · React · Node.js",
    blurb:
      "Centralized DevOps management suite providing real-time pipeline monitoring, container orchestration telemetry, and automated deployment workflows.",
    year: "2026",
    tint: "#c7c2b8",
    surface:
      "radial-gradient(110% 80% at 80% 10%, #1e1d1a 0%, #0c0b0a 60%), linear-gradient(135deg, #15140f, #0a0908)",
    icon: "devops",
  },
  {
    index: "03",
    title: "MediCare Health & Appointments",
    category: "Healthcare & Patient Management",
    stack: "MongoDB · Express · React · Node.js",
    blurb:
      "End-to-end healthcare portal enabling real-time doctor appointment bookings, patient record tracking, and virtual consultation scheduling.",
    year: "2026",
    tint: "#a7a299",
    surface:
      "radial-gradient(120% 90% at 70% 30%, #201f1c 0%, #0d0c0b 60%), linear-gradient(135deg, #161512, #0a0908)",
    icon: "health",
  },
  {
    index: "04",
    title: "EcoMed Solutions",
    category: "Business Ecosystem Management",
    stack: "Angular",
    blurb:
      "Enterprise management application designed to orchestrate healthcare business ecosystems, supply chain logistics, and multi-vendor operations.",
    year: "2026",
    tint: "#837e75",
    surface:
      "radial-gradient(120% 90% at 30% 80%, #1b1a17 0%, #0c0b0a 60%), linear-gradient(135deg, #141310, #0a0908)",
    icon: "eco",
  },
];

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const narrow = useMediaQuery("(max-width: 767px)");
  const reduced = usePrefersReducedMotion();
  // single source of truth: stack vertically (no pin) on small screens, touch
  // devices, or when reduced motion is requested — pin/scrub otherwise.
  const stacked = coarse || narrow || reduced;

  useGSAP(() => {
    if (stacked) return;
    const trackEl = track.current!;
    const getScroll = () => trackEl.scrollWidth - window.innerWidth;

    const tween = gsap.to(trackEl, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: () => `+=${getScroll()}`,
        pin: true,
        scrub: 1, // inertia / smoothing on the horizontal track
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // progress bar
    const bar = section.current!.querySelector(
      "[data-work-bar]",
    ) as HTMLElement;
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: () => `+=${getScroll()}`,
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [stacked]);

  return (
    <section
      id="work"
      ref={section}
      className="relative overflow-hidden bg-[var(--color-ink)]"
    >
      {/* scroll hint — visible on desktop horizontal mode */}
      {!stacked && (
        <div className="pointer-events-none absolute right-[var(--gutter)] top-0 z-20 hidden pt-28 md:block">
          <p className="label text-right">
            Drag · Scroll
            <br />
            {PROJECTS.length} projects
          </p>
        </div>
      )}

      {/* track — horizontal (pinned) on desktop, vertical stack otherwise */}
      <div
        ref={track}
        className={
          stacked
            ? "flex flex-col gap-14 px-[var(--gutter)] pb-24 pt-28"
            : "flex h-[100svh] items-center gap-[6vw] px-[var(--gutter)] will-change-transform"
        }
        style={stacked ? undefined : { width: "max-content" }}
      >
        {/* intro plate */}
        <div
          className={`flex shrink-0 flex-col justify-center ${
            stacked ? "w-full" : "h-[70vh] w-[clamp(540px,64vw,980px)]"
          }`}
        >
          <div className="grid grid-cols-12 items-start gap-y-8 md:gap-x-8">
            <p className="label col-span-12 md:col-span-3">
              <span className="text-[var(--color-acid)]">[02]</span>
              <br />
              Selected work
            </p>

            <div className="col-span-12 md:col-span-9">
              <h2 className="text-h2 font-display leading-[0.9]">
                Things I&rsquo;ve
                <br />
                <span className="font-serif font-normal italic text-[var(--color-acid)]">
                  built
                </span>
                .
              </h2>
              <p className="mt-6 max-w-[34ch] text-body text-[var(--color-bone-dim)]">
                Selected builds across MERN stack and Angular — web platforms and mobile apps crafted for production.
              </p>
            </div>
          </div>
        </div>

        {PROJECTS.map((p) => (
          <Card key={p.index} project={p} stacked={stacked} />
        ))}

        {/* end plate */}
        <div
          className={`flex shrink-0 flex-col justify-center ${stacked ? "w-full py-6" : "h-[70vh] w-[42vw]"}`}
        >
          <p className="label mb-4">More on request</p>
          <a
            href="#contact"
            data-cursor="view"
            data-cursor-label="Say hi"
            className="text-h3 font-display leading-none transition-colors hover:text-[var(--color-acid)]"
          >
            Let&rsquo;s
            <br />
            talk →
          </a>
        </div>
      </div>

      {/* scrub progress (horizontal mode only) */}
      {!stacked && (
        <div className="absolute inset-x-[var(--gutter)] bottom-8 z-20 hidden h-px bg-[var(--color-bone)]/15 md:block">
          <div
            data-work-bar
            className="h-full w-full origin-left scale-x-0 bg-[var(--color-acid)]"
          />
        </div>
      )}
    </section>
  );
}

function Card({ project, stacked }: { project: Project; stacked: boolean }) {
  return (
    <article
      data-cursor="view"
      data-cursor-label="View"
      className={`group relative shrink-0 overflow-hidden rounded-[2px] ${
        stacked ? "h-[60vh] w-full" : "h-[70vh] w-[clamp(320px,46vw,640px)]"
      }`}
      style={{ background: project.surface }}
    >
      {/* accent edge that grows on hover */}
      <span
        className="absolute left-0 top-0 z-10 h-1 w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
        style={{ background: project.tint }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10">
        <div className="flex items-start justify-between font-mono text-label uppercase tracking-[0.16em] text-[var(--color-bone-dim)]">
          <span style={{ color: project.tint }}>{project.index}</span>
          <span>{project.year}</span>
        </div>

        <div data-card-meta>
          <ProjectIcon
            kind={project.icon}
            className="mb-4 h-8 w-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
            style={{ color: project.tint }}
          />
          <p className="label mb-3">{project.category}</p>
          <h3 className="font-display text-[clamp(1.6rem,4.2vw,3.75rem)] leading-[0.95] [overflow-wrap:break-word] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[40ch] text-body leading-snug text-[var(--color-bone-dim)] opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:opacity-0 md:group-hover:opacity-100">
            {project.blurb}
          </p>
          <p
            className="mt-4 font-mono text-micro uppercase tracking-[0.16em]"
            style={{ color: project.tint }}
          >
            {project.stack}
          </p>
        </div>
      </div>

      {/* hover wash */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(80% 60% at 50% 100%, ${project.tint}14, transparent 70%)`,
        }}
      />
    </article>
  );
}

// one small line-icon per project, matching what it actually does rather than
// a generic badge — kept in the same thin-stroke language as the rest of the
// site's iconography (mic/speaker/send in Assistant.tsx).
function ProjectIcon({
  kind,
  className,
  style,
}: {
  kind: IconKind;
  className?: string;
  style?: CSSProperties;
}) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg className={className} style={style} {...shared}>
      {kind === "pharma" && (
        <>
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </>
      )}
      {kind === "devops" && (
        <>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="12" r="3" />
          <line x1="6" y1="9" x2="6" y2="15" />
          <path d="M6 9a9 9 0 0 1 9 3" />
        </>
      )}
      {kind === "health" && (
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      )}
      {kind === "eco" && (
        <>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </>
      )}
      {kind === "lens" && (
        <>
          <circle cx="10.2" cy="10.2" r="6.7" />
          <path d="M15.2 15.2 21 21" />
        </>
      )}
      {kind === "voice" && (
        <>
          <path d="M3 12h.01" />
          <path d="M7.5 8.5v7" />
          <path d="M12 4.5v15" />
          <path d="M16.5 8.5v7" />
          <path d="M21 12h.01" />
        </>
      )}
      {kind === "study" && (
        <path d="M2.5 4.5h6a3.5 3.5 0 0 1 3.5 3.5v13a2.5 2.5 0 0 0-2.5-2.5h-7zM21.5 4.5h-6A3.5 3.5 0 0 0 12 8v13a2.5 2.5 0 0 1 2.5-2.5h7z" />
      )}
      {kind === "collab" && (
        <>
          {/* two cursor arrows, clearly offset — reads as "live, multiple
              collaborators" rather than a single pointer */}
          <path
            d="M3 3l7.07 16.97 2.51-7.39L21 12 3 3z"
            transform="translate(-2,-2) scale(0.55)"
            fill="currentColor"
            stroke="#0f0e0c"
            strokeWidth={1}
            opacity={0.4}
          />
          <path
            d="M3 3l7.07 16.97 2.51-7.39L21 12 3 3z"
            transform="translate(7,7) scale(0.55)"
            fill="currentColor"
            stroke="#0f0e0c"
            strokeWidth={1}
          />
        </>
      )}
    </svg>
  );
}
