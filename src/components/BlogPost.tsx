'use client'

import { blogContentToJSX, BlogEntry } from "@/types";
import React from "react";
type Props = {
    post: BlogEntry | null
}

export default function BlogPost ({ post } : Props) {
    if (!post) return null;

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="prose prose-neutral max-w-none">
                {post.content.map((item, idx) => (
                    <React.Fragment key={idx}>
                        {blogContentToJSX(item)}
                    </React.Fragment>
                ))}
            </div>
        </main>
    );
}
