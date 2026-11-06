// Vercel Edge Function — RAG-over-CV assistant powered by Groq (OpenAI-compatible API).
// The whole profile is the grounding context, and the model is told to answer only from it.
// Streams plain text back to the client.

export const config = { runtime: "edge" };

// Tried in order; first one that succeeds is used.
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "openai/gpt-oss-20b",
];

// --- Yash's grounding profile (the "knowledge base") -----------------------
const PROFILE = `
YASH CHALKE — Frontend Developer & Full Stack Engineer
Location: Pune, India. Status: open to Frontend Developer and Full Stack engineering roles.
Contact: email chalkeyash11@gmail.com · phone +91 8956509311 · LinkedIn linkedin.com/in/yashchalke75 · Instagram instagram.com/yaaashhh___.

SUMMARY
Frontend Developer building scalable web and mobile applications with React.js, Angular, TypeScript and Next.js on the frontend, and Node.js, Express, MongoDB and PostgreSQL on the backend. Focused on clean UI architecture, reusable component design, smooth animations, RESTful API integrations and production-ready user experiences.

EXPERIENCE
1) Frontend Developer — PortalWiz Technologies, Sep 2026 — Present.
   - Working extensively with Angular and TypeScript on the EcoMed platform.
   - Building modular UI components, implementing robust state management, and optimizing frontend performance.
   - Collaborating closely with cross-functional teams to deliver enterprise-grade business ecosystem solutions.
2) Frontend Developer — MyVyay, Jan 2026 — Jul 2026.
   - Engineered scalable full-stack web and mobile features using the MERN stack (MongoDB, Express, React, Node.js).
   - Developed key frontend modules and APIs for Zeux LifeSciences (pharmaceutical e-commerce platform for Mexico).
   - Contributed to the MyVyay 3.0 Mobile App development with React Native and modern frontend tooling.

SKILLS
Frontend: React.js, Angular, TypeScript, Next.js, React Native, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, Responsive Design.
Backend & Databases: Node.js, Express.js, MongoDB, PostgreSQL, MERN Stack, REST APIs, JSON.
Platform & Tools: Git, GitHub, CI/CD, Vercel, Postman, npm, Vite.

FEATURED PROJECTS
- Zeux LifeSciences: Scalable pharmaceutical e-commerce platform for Mexico built with MERN stack, featuring catalog exploration, prescription validation, and secure checkout.
- OpsFlow DevOps Suite: Centralized DevOps and cloud telemetry dashboard for monitoring deployment pipelines and automated workflows (MERN stack).
- MediCare Health & Appointments: End-to-end digital healthcare portal enabling real-time doctor appointment bookings, patient record management, and consultation scheduling (MERN stack).
- EcoMed Solutions: Enterprise application built with Angular and TypeScript to orchestrate and streamline healthcare business ecosystems and supply chain operations.

EDUCATION
BSc in Information Technology, University of Mumbai.
`;

const SYSTEM = `You are the AI assistant on Yash Chalke's portfolio website. You answer questions
from recruiters and hiring managers about Yash, grounded ONLY in the PROFILE below.

Rules:
- Answer ONLY from the PROFILE. Never invent facts, employers, dates, or skills.
- If something isn't in the PROFILE, say you don't have that detail and suggest emailing
  chalkeyash11@gmail.com or connecting on LinkedIn.
- Be concise and natural — 1 to 4 short sentences. Answers may be read aloud, so avoid markdown,
  bullet symbols, links and code blocks; write plain conversational sentences.
- Refer to him as "Yash". Be warm, professional and confident.
- For availability/hiring questions, note he's actively open to Frontend Developer and Full Stack roles
  and point to chalkeyash11@gmail.com or LinkedIn to connect.

PROFILE:
${PROFILE}`;

type Msg = { role: "user" | "assistant"; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return new Response(
      "The assistant isn't configured yet. Please reach Yash at chalkeyash11@gmail.com.",
      { status: 503 },
    );
  }

  let messages: Msg[];
  try {
    const body = (await req.json()) as { messages?: Msg[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // guards (abuse / cost control — Groq free tier also rate-limits usage)
  messages = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));

  if (messages.length === 0) return new Response("No message", { status: 400 });

  const payload = {
    messages: [{ role: "system", content: SYSTEM }, ...messages],
    max_completion_tokens: 400,
    temperature: 0.4,
    top_p: 0.9,
    stream: true,
  };

  let upstream: Response | null = null;
  let lastErr = "";
  for (const model of MODELS) {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ ...payload, model }),
    });
    if (r.ok && r.body) {
      upstream = r;
      break;
    }
    lastErr = `${model} -> ${r.status} ${(await r.text().catch(() => "")).slice(0, 100)}`;
    console.error("[chat] model attempt failed:", lastErr);
  }

  if (!upstream || !upstream.body) {
    console.error("[chat] all models failed, last error:", lastErr);
    return new Response(
      "The assistant is briefly unavailable. Please try again in a moment, or email chalkeyash11@gmail.com.",
      { status: 502 },
    );
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let buffer = "";
      (async () => {
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let nl: number;
            while ((nl = buffer.indexOf("\n")) >= 0) {
              const line = buffer.slice(0, nl).trim();
              buffer = buffer.slice(nl + 1);
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const text: string = json?.choices?.[0]?.delta?.content ?? "";
                if (text) controller.enqueue(encoder.encode(text));
              } catch {
                /* ignore partial json */
              }
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      })();
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
