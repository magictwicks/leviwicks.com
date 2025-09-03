"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPost({ body }: { body: string }) {
  return (
    <article className="prose prose-invert max-w-none px-6 py-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {body}
      </ReactMarkdown>
    </article>
  );
}
