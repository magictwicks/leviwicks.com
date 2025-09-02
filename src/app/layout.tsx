import "./../styles/globals.css";

export const metadata = {
    title: "Your Site",
    description: "Travel + posts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-black text-white">{children}</body>
        </html>
    );
}
  