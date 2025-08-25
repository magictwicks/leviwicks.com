// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { BlogEntry, BlogParagraph, BlogHeader, BlogImage, City } from "@/types";

export type Data = {
    cities: City[],
    entries: BlogEntry[],
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const SB: City = {location: {lat: 34.42083, lon: -119.69819}, name: "Santa Barbara"};
    const LA: City = {location: {lat: 34.05223, lon: -118.24368}, name: "Los Angeles"};
    const SD: City = {location: {lat: 32.71571, lon: -117.16472}, name: "San Diego"};
    const example1: BlogEntry = {
        location: SB,
        date: new Date().getTime(),
        title: "Blog Entry 1",
        content: [
            { type: "BlogHeader", title: "Header 1" },
            { type: "BlogParagraph", text: "paragraph 1" },
            { type: "BlogParagraph", text: "paragraph 2" },
            { type: "BlogHeader", title: "Header 2" },
            { type: "BlogParagraph", text: "paragraph 3" },
            { type: "BlogParagraph", text: "paragraph 4" },
            { type: "BlogParagraph", text: "paragraph 5" },
        ]
    };
    const example2: BlogEntry = {
        location: LA,
        date: new Date().getTime(),
        title: "Blog Entry 2",
        content: [
            { type: "BlogHeader", title: "Header 1" },
            { type: "BlogParagraph", text: "paragraph 1" },
            { type: "BlogParagraph", text: "paragraph 2" },
            { type: "BlogParagraph", text: "paragraph 3" },
            { type: "BlogParagraph", text: "paragraph 4" },
            { type: "BlogHeader", title: "Header 2" },
            { type: "BlogParagraph", text: "paragraph 5" },
            { type: "BlogHeader", title: "Header 3" },
            { type: "BlogParagraph", text: "paragraph 6" },
        ]
    };
    const example3: BlogEntry = {
        location: LA,
        date: new Date().getTime(),
        title: "Blog Entry 3",
        content: [
            { type: "BlogHeader", title: "Header 1" },
            { type: "BlogParagraph", text: "paragraph 1" },
            { type: "BlogParagraph", text: "paragraph 2" },
        ]
    };

    res.status(200).json({
        cities: [SB, LA],
        entries: [example1, example2, example3],
    });
}
