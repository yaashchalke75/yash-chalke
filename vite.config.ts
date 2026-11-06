import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function devChatPlugin(): Plugin {
  return {
    name: "dev-chat-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/chat" && req.method === "POST") {
          const env = loadEnv(server.config.mode, process.cwd(), "");
          if (env.GROQ_API_KEY) {
            process.env.GROQ_API_KEY = env.GROQ_API_KEY;
          }

          let body = "";
          req.on("data", (chunk: any) => {
            body += typeof chunk === "string" ? chunk : chunk.toString();
          });

          req.on("end", async () => {
            try {
              const url = `http://${req.headers.host || "localhost"}${req.url}`;
              const WebRequest = (globalThis as any).Request;
              const webReq = new WebRequest(url, {
                method: "POST",
                headers: req.headers as Record<string, string>,
                body,
              });

              const mod: any = await server.ssrLoadModule("./api/chat.ts");
              const handler = mod.default;
              const webRes: any = await handler(webReq);

              res.statusCode = webRes.status;
              webRes.headers.forEach((val: string, key: string) => {
                res.setHeader(key, val);
              });

              if (webRes.body) {
                const reader = webRes.body.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
                res.end();
              } else {
                res.end();
              }
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "text/plain; charset=utf-8");
              const msg = err instanceof Error ? err.message : String(err);
              res.end(`Assistant error: ${msg}`);
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devChatPlugin()],
  build: {
    target: "es2020",
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          ogl: ["ogl"],
          gsap: ["gsap"],
        },
      },
    },
  },
});
