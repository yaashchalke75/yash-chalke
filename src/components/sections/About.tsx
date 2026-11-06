import { useRef, useState } from "react";
import { useGSAP } from "../../lib/useGSAP";
import { gsap } from "../../lib/smoothScroll";
import { Reveal } from "../ui/Reveal";

// Portrait lives in /public so it can be swapped without a rebuild.
// If it's missing, the monogram fallback below shows instead.
const portraitJpg = "/portrait.jpg";
const portraitWebp = "/portrait.webp";

// Dynamically compute years in production based on career start date (Jan 2026)
const getYearsInProduction = () => {
  const startDate = new Date(2026, 0, 1);
  const now = new Date();
  const months =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());
  return Math.max(1, Math.floor(months / 12) || 1);
};

const yearsInProduction = getYearsInProduction();

const STATS = [
  {
    value: yearsInProduction,
    suffix: "+",
    label: yearsInProduction === 1 ? "Year in production" : "Years in production",
  },
  { value: 40, suffix: "%", label: "Avg performance lift" },
  { value: 3, suffix: "+", label: "Platforms shipped" },
  { value: 100, suffix: "ms", label: "Response-time target" },
];

const TIMELINE = [
  {
    range: "Sep 2026 — Present",
    role: "Frontend Developer",
    org: "PortalWiz Technologies",
    note: "Angular development on the EcoMed project, building modular UI components, state management and scalable frontend architecture.",
  },
  {
    range: "Jan 2026 — Jul 2026",
    role: "Frontend Developer",
    org: "MyVyay",
    note: "MERN stack engineering across Zeux LifeSciences and the MyVyay 3.0 Mobile App, delivering responsive UIs and API integrations.",
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration: 2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = String(Math.round(obj.v));
        },
      });
    },
    [],
    // reduced motion: show the final number immediately
    () => {
      if (ref.current) ref.current.textContent = String(value);
    },
  );
  return (
    <span className="tabular-nums">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function About() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section id="about" className="relative bg-[var(--color-coal)] px-[var(--gutter)] py-[14vh] md:py-[20vh]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        {/* portrait — sticky, offset left, asymmetric */}
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="label mb-8">
              <span className="text-[var(--color-acid)]">[04]</span>
              <br />
              About
            </p>

            <figure
              data-cursor="hover"
              className="group relative aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[3px] bg-[radial-gradient(120%_90%_at_30%_20%,#35322e,#0e0d0b)]"
            >
              {/* monogram fallback (shows if the portrait is missing) */}
              <span className="absolute inset-0 flex items-center justify-center font-display text-mega leading-none text-[var(--color-bone)]/10">
                YC
              </span>

              {imgOk && (
                <picture>
                  <source srcSet={portraitWebp} type="image/webp" />
                  <img
                    src={portraitJpg}
                    alt="Yash Chalke"
                    width={880}
                    height={1100}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgOk(false)}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </picture>
              )}

              {/* acid duotone wash + grain seat */}
              <span className="pointer-events-none absolute inset-0 bg-[var(--color-acid)] opacity-0 mix-blend-color transition-opacity duration-700 group-hover:opacity-25" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,9,8,0.7),transparent_55%)]" />

              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 font-mono text-micro uppercase tracking-[0.16em] text-[var(--color-bone)]">
                <span>Yash Chalke</span>
                <span className="text-[var(--color-acid)]">IND</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* bio + experience timeline, pushed right */}
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <SplitHeading />

          <Reveal as="p" className="mt-8 max-w-[52ch] text-lead font-light leading-[1.45] text-[var(--color-bone-dim)]">
            Frontend Developer building scalable web and mobile applications — React.js, TypeScript and Angular on the frontend, Node.js and MongoDB underneath. Focused on clean UI architecture, reusable components, API integrations and production-ready user experiences.
          </Reveal>

          {/* experience timeline */}
          <ul className="mt-16 border-t edge">
            {TIMELINE.map((t) => (
              <li
                key={t.range}
                className="group grid grid-cols-12 gap-x-4 gap-y-1 border-b edge py-6 transition-colors"
              >
                <span className="col-span-12 font-mono text-micro uppercase tracking-[0.16em] text-[var(--color-ash)] md:col-span-3">
                  {t.range}
                </span>
                <div className="col-span-12 md:col-span-9">
                  <p className="font-display text-h3 leading-none text-[var(--color-bone)] transition-colors duration-500 group-hover:text-[var(--color-acid)]">
                    {t.role}
                  </p>
                  <p className="mt-2 text-body text-[var(--color-bone-dim)]">{t.org}</p>
                  <p className="mt-1 max-w-[48ch] text-body text-[var(--color-ash)]">{t.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[52ch] text-body text-[var(--color-ash)]">
            BSc In Information Technology, University of Mumbai
          </p>
        </div>
      </div>

      {/* stat band — breaks the column rhythm */}
      <div className="mt-24 grid grid-cols-2 gap-px border edge bg-[var(--color-bone)]/[0.06] md:mt-32 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-[var(--color-coal)] p-7 md:p-9">
            <p className="font-display text-[clamp(2.4rem,4.5vw,5rem)] leading-none text-[var(--color-bone)]">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="label mt-4">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SplitHeading() {
  return (
    <h2 className="font-display text-[clamp(2.2rem,3.8vw,4.75rem)] leading-[0.92]">
      Developer
      <br />
      <span className="font-serif font-normal italic text-[var(--color-acid)]">who ships</span>.
    </h2>
  );
}
