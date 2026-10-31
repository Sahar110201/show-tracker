import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: {
    default: "Show Tracker",
    template: "%s | Show Tracker",
  },
  description: "Track the TV shows you watch",
};

// The root layout wraps every page. The header stays on screen while Link swaps the page below it.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <Link href="/">Show Tracker</Link>
            <Link href="/">Watchlist</Link>
            <Link href="/search">Search</Link>
            <Link href="/add">Add show</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}