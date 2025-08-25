'use client'

import { useEffect, useState } from "react";
import BlogPost from "@/components/BlogPost";
import { BlogEntry, City } from "@/types";
import { InferGetStaticPropsType } from "next";

type Data = {
    cities: City[],
    entries: BlogEntry[],
}

type staticProps = {
    props: Data
}

// This function gets called at build time
// https://en.nextjs.im/docs/app/guides/static-exports
export async function getStaticProps(): Promise<staticProps> {
    // TODO: this is the host and port that the blog json output runs on at comp time
    const data = await (await fetch('http://localhost:5000')).json() as Data;

    // By returning { props: { posts } }, the Home component
    // will receive `posts` as a prop at build time
    return {
        props: data,
    }
}

export default function Home({ cities, entries }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [ currentBlog, setCurrentBlog ] = useState<BlogEntry | null>(null);

    useEffect(() => {
        const L = require("leaflet");

        const map = L.map('map').setView([34.44928, -119.66111], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const cityMapping: { [key: string]: BlogEntry } = {}
        for (const entry of entries) {
            cityMapping[entry.location.name] = entry
        }

        for (const city of cities) {
            const marker = L.marker([city.location.lat, city.location.lon]).addTo(map);
            marker.bindPopup(`<b>${city.name}</b>`);
            marker.on("click", () => {setCurrentBlog(cityMapping[city.name])});
        }

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
