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
            <main className="grid grid-cols-2 h-screen">
                <div className="flex-1 p-24">
                    {currentBlog ? 
                        <BlogPost post={currentBlog}></BlogPost> 
                            :
                        <>
                            <h1 className="text-3xl font-bold py-3">Welcome to Levi's Travel Blog!</h1>
                            <p className="text-lg py-3">The blog will showcase cultural experiences, significant moments, and personal thoughts from my time traveling the world in Fall 2025. 
                                Each blog post will appear is a pin drop on the map and will mark the city which I am writing from.
                                If anyone wishes to contact me my international phone can be reached at: (949) 664-3825 </p>
                        </>
                    }
                </div>
                <div className="h-full">
                    <div id="map" className="h-full w-full"></div>
                </div>
            </main>
        </>

    )
}
