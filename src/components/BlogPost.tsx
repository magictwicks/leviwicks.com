"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogContent({ body }: { body: string }) {
  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            return inline ? (
              <code className="px-1 py-0.5 rounded" {...props}>{children}</code>
            ) : (
              <pre className="p-4 rounded overflow-x-auto">
                <code className={className} {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </article>
  );
}
