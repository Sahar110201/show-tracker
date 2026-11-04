import Link from "next/link";
import "./globals.css";
import FlashMessage from "./components/FlashMessage";
import { MessageProvider } from "./components/MessageContext";

export const metadata = {
  title: {
    default: "Show Tracker",
    template: "%s | Show Tracker",
  },
  description: "Track the TV shows you watch",
};

// The root layout wraps every page. The header stays on screen while Link swaps the page below it.
// MessageProvider goes around everything, so a message set on one page still shows on the next one.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MessageProvider>
          <header>
            <nav>
              <Link href="/">Show Tracker</Link>
              <Link href="/watchlist">Watchlist</Link>
              <Link href="/search">Search</Link>
              <Link href="/comments">Comments</Link>
              <Link href="/add">Add show</Link>
            </nav>
          </header>
          <main>
            {/* The green bar with messages like "Comment added" */}
            <FlashMessage />
            {children}
          </main>
        </MessageProvider>
      </body>
    </html>
  );
}