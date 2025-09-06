// src/components/BlogContent.tsx
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toAbsolute, toImageProxy } from "@/lib/url";

export default function BlogContent({ body }: { body: string }) {
  return (
    <main className="w-full mx-auto px-4 md:w-[40vw] md:px-0">
      <article className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img({ src, alt, ...props }) {
              const s = typeof src === "string" ? src : "";
              // If author already wrote /api/image?... or http(s), keep; else proxy
              const resolved = s.startsWith("/api/image") || /^(https?:)?\/\//i.test(s)
                ? toAbsolute(s)
                : toImageProxy(s);
              return <img src={resolved} alt={(alt as string) || ""} {...props} />;
            },
            a({ href, children, ...props }) {
              const h = typeof href === "string" ? href : "";
              return (
                <a href={toAbsolute(h)} {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </article>
    </main>
  );
}
