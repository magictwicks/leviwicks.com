'use client'

import { useEffect, useState } from "react";
import BlogPost from "@/components/BlogPost";
import { BlogEntry, BlogParagraph, BlogHeader, BlogImage, City } from "@/types";
//import { getBlogData } from "@/pages/api/util";
import { InferGetStaticPropsType } from "next";

type staticProps = {
    props: {
        posts: any[]
    }
}

// This function gets called at build time
export async function getStaticProps(): Promise<staticProps> {
    // Call an external API endpoint to get posts

    const city: City = {location: {x: 0, y: 0}, name: "nowhere"};
    const example1 = new BlogEntry(city, "A Blog Entry", [
        new BlogHeader("Header 1"),
        new BlogParagraph("paragraph 1"),
        new BlogParagraph("paragraph 2"),
        new BlogParagraph("paragraph 3"),
        new BlogHeader("Header 2"),
        new BlogParagraph("paragraph 4"),
        new BlogParagraph("paragraph 5"),
    ])
    const example2 = new BlogEntry(city, "Another Blog Entry", [
        new BlogHeader("Header 1"),
        new BlogParagraph("paragraph 1"),
        new BlogParagraph("paragraph 2"),
        new BlogParagraph("paragraph 3"),
        new BlogHeader("Header 2"),
        new BlogParagraph("paragraph 4"),
        new BlogParagraph("paragraph 5"),
    ])
    const res = [example1.serialize(), example2.serialize()];

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            posts: res
        },
    }
}

// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [ currentBlog, setCurrentBlog ] = useState<BlogEntry | null>(null);

    const allBlogs: BlogEntry[] = [];
    for (const e of posts) {
        allBlogs.push(BlogEntry.deserialize(e));
    }

    useEffect(() => {
        const L = require("leaflet");

        const map = L.map('map').setView([34.44928, -119.66111], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const marker0 = L.marker([34.44928, -119.66111]).addTo(map);
        marker0.bindPopup("<b>Westmont College</b>");
        marker0.on("click", () => {setCurrentBlog(allBlogs[0])});

        const marker1 = L.marker([33.722108, -118.014067]).addTo(map);
        marker1.bindPopup("<b>Levi's House</b>");
        marker1.on("click", () => {setCurrentBlog(allBlogs[1])});

        const marker2 = L.marker([32.975588, -117.136778]).addTo(map);
        marker2.bindPopup("<b>Curtis' House</b");
        marker2.on("click", () => {setCurrentBlog(allBlogs[2])});

        map.on("click", () => setCurrentBlog(null));
    }, [])

    return (
        <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""/>
            <ul>
                <div id="map" className="h-120 w-full"></div>
            </ul>
            <BlogPost post={currentBlog}></BlogPost> 
        </>
    )
}
