import Magnetic from "../ui/Magnetic";
import { SplitReveal } from "../ui/Reveal";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[var(--color-void)] px-[var(--gutter)] pb-8 pt-[16vh]"
    >
      <div className="grid grid-cols-12 gap-y-12">
        <p className="label col-span-12 md:col-span-3">
          <span className="text-[var(--color-acid)]">[05]</span>
          <br />
          Contact
        </p>

        <div className="col-span-12 md:col-span-9">
          <SplitReveal
            as="h2"
            text="Let's build something that ships."
            className="text-h2 font-display leading-[0.95]"
          />

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Magnetic strength={0.4}>
              <a
                href="mailto:chalkeyash11@gmail.com"
                data-cursor="hover"
                className="group inline-flex max-w-full items-center gap-3 rounded-full bg-[var(--color-acid)] px-6 py-4 font-display text-base font-bold text-[var(--color-void)] transition-[gap] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-6 sm:gap-4 sm:px-8 sm:py-5 sm:text-lg"
              >
                <span className="truncate">chalkeyash11@gmail.com</span>
                <span className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>
            <p className="max-w-[28ch] text-body text-[var(--color-bone-dim)]">
              <span className="text-[var(--color-acid)]">●</span> Open to Frontend &amp; Full
              Stack developer roles.
            </p>
          </div>
        </div>
      </div>

      {/* link columns */}
      <div className="mt-24 grid grid-cols-2 gap-8 border-t edge pt-10 md:grid-cols-4">
        <div>
          <p className="label mb-4">Contact</p>
          <p className="text-body text-[var(--color-bone-dim)]">
            Pune, IND
            <br />
            <a href="tel:+918956509311" data-cursor="hover" className="transition-colors hover:text-[var(--color-acid)]">
              +91 8956509311
            </a>
          </p>
        </div>
        <div>
          <p className="label mb-4">Elsewhere</p>
          <ul className="space-y-1 text-body text-[var(--color-bone-dim)]">
            {[
              ["LinkedIn", "https://www.linkedin.com/in/yashchalke75"],
              ["Instagram", "https://www.instagram.com/yaaashhh___/"],
              ["Email", "mailto:chalkeyash11@gmail.com"],
            ].map(([l, h]) => (
              <li key={l}>
                <a
                  href={h}
                  target={h.startsWith("http") ? "_blank" : undefined}
                  rel={h.startsWith("http") ? "noreferrer" : undefined}
                  data-cursor="hover"
                  className="transition-colors hover:text-[var(--color-acid)]"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-4">Index</p>
          <ul className="space-y-1 text-body text-[var(--color-bone-dim)]">
            {[
              ["Work", "#work"],
              ["Stack", "#stack"],
              ["About", "#about"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} data-cursor="hover" className="transition-colors hover:text-[var(--color-acid)]">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right">
          <p className="label mb-4">Now</p>
          <p className="text-body text-[var(--color-bone-dim)]">
            Building scalable web &amp; mobile apps with React, Angular, TypeScript &amp; Node.js — and open to what&rsquo;s next.
          </p>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="pointer-events-none mt-12 select-none">
        <h2 className="text-center font-display text-mega font-extrabold leading-[0.9] tracking-tight text-[var(--color-bone)]">
          YASH<span className="text-[var(--color-acid)]">°</span>
        </h2>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t edge pt-6 font-mono text-micro uppercase tracking-[0.16em] text-[var(--color-ash)] md:flex-row">
        <span>© {year} Yash Chalke</span>
        <span>Frontend Developer</span>
        <span>Pune, IND</span>
      </div>
    </footer>
  );
}
