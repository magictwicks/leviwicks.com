import "../styles/globals.css"; // <-- matches your error path

export const metadata = {
    title: "gobsmacked",
    description: "bits and bobs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen">{children}</body>
        </html>
    );
}
  