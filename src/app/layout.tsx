import "../styles/globals.css"; // <-- matches your error path

export const metadata = {
    title: "gobsmacked",
    description: "bits and bobs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* CDN */}
                    <link
                        rel="stylesheet"
                        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                        crossOrigin="anonymous"
                    />
                </head>
            <body className="min-h-screen">{children}</body>
        </html>
    );
}
  