"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Simple Markdown → JSX with GitHub-flavored Markdown:
 * - bullet & numbered lists ✅
 * - tables, task lists, strikethrough, autolinks ✅
 * By default, raw HTML inside Markdown is NOT rendered (safer).
 */
export default function BlogPost({ body }: { body: string }) {
  return (
    <article className="prose prose-invert max-w-none"> 
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // optional: tweak tags if you want tighter control
          ul: (props) => <ul className="list-disc pl-6 my-3" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 my-3" {...props} />,
          li: (props) => <li className="my-1" {...props} />,
          a: (props) => <a className="underline" target="_blank" rel="noreferrer" {...props} />,
          img: (props) => <img loading="lazy" decoding="async" {...props} />,
          code: ({ inline, className, children, ...rest }) =>
            inline ? (
              <code className="px-1 py-0.5 rounded" {...rest}>{children}</code>
            ) : (
              <pre className="p-4 rounded overflow-x-auto"><code className={className} {...rest}>{children}</code></pre>
            ),
        }}
      >
        {body}
      </ReactMarkdown>
    </article>
  );
}
