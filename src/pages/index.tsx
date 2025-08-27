import Head from "next/head";
import { useEffect, useState } from "react";
import BlogPost from "@/components/BlogPost";
import type { BlogEntry, City } from "@/types";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { LoadedData } from "@/lib/blog/types";

type Props = { data: LoadedData };

// SSR: load your files on the server
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { loadBlogData } = await import("@/lib/blog/loader");
  const data = await loadBlogData();
  return { props: { data } };
};

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [currentBlog, setCurrentBlog] = useState<BlogEntry | null>(null);

  useEffect(() => {
    let map: any;

    (async () => {
      // dynamic import avoids bundling issues and keeps it client-only
      const { default: L } = await import("leaflet");

      map = L.map("map").setView([34.44928, -119.66111], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const cityMapping: Record<string, BlogEntry> = {};
      for (const entry of data.entries) {
        cityMapping[entry.location.name] = entry;
      }

      for (const city of data.cities) {
        const marker = L.marker([city.location.lat, city.location.lon]).addTo(
          map
        );
        marker.bindPopup(`<b>${city.name}</b>`);
        marker.on("click", () => {
          setCurrentBlog(cityMapping[city.name] ?? null);
        });
      }

      map.on("click", () => setCurrentBlog(null));
    })();

    // cleanup to satisfy lint and prevent duplicate maps on HMR
    return () => {
      if (map) map.remove();
    };
  }, [data.cities, data.entries]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <main className="grid grid-cols-2 h-screen">
        <div className="flex-1 p-24 overflow-y-auto">
          {currentBlog ? (
            <BlogPost post={currentBlog} />
          ) : (
            <>
              <h1 className="text-3xl font-bold py-3">
                {`Here's Levi's Travel Blog! ✈️`}
              </h1>
              <p className="text-lg py-3">
                The blog will showcase cultural experiences, significant
                moments, and personal thoughts from my time traveling the world
                in Fall 2025. Each blog post will appear as a pin drop on the
                map and will mark the city which I am writing from. If anyone
                wishes to contact me my international phone can be reached at:
                (949) 664-3825
              </p>
            </>
          )}
        </div>
        <div className="h-full">
          <div id="map" className="h-full w-full" />
        </div>
      </main>
    </>
  );
}
