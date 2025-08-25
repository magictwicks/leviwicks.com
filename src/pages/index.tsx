'use client'

import { useEffect, useState } from "react";
import BlogPost from "@/components/BlogPost";
import { BlogEntry } from "@/types";
import { InferGetStaticPropsType } from "next";
import { Data } from "./api/util";

type staticProps = {
    props: Data
}

// This function gets called at build time
export async function getStaticProps(): Promise<staticProps> {
    // TODO: this will have to be changed to point at the current website name
    const res = await (await fetch('http://localhost:3000/api/util')).json() as Data;

    // By returning { props: { posts } }, the Home component
    // will receive `posts` as a prop at build time
    return {
        props: res,
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
