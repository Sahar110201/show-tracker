import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: {
    default: "Show Tracker",
    template: "%s | Show Tracker",
  },
  description: "Track the TV shows you watch",
};

// Root layout shared by all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Home</Link>

            <Link href="/watchlist">
              Watchlist
            </Link>

            <Link href="/search">
              Search
            </Link>

            <Link href="/add">
              Add Show
            </Link>
          </nav>
        </header>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}