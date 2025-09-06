// src/components/BlogContent.tsx
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogContent({ body }: { body: string }) {
  return (
    <main className="markdown post-wrap">
      <article className="prose prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {body}
        </ReactMarkdown>
      </article>
    </main>
  );
}
