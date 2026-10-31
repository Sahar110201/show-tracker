import Link from "next/link";

// This is shown for any URL that does not match a page and whenever a page calls notFound()
export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>That page or show does not exist.</p>
      <Link href="/search">Back to search</Link>
    </section>
  );
}