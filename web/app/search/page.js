import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Search',
};

// Asks our Express API for the shows that match q. It runs on the server.
// process.env.API_URL is the API address from the .env.local file (not written in the code).
// It never calls TVmaze directly. It only talks to our own API.
async function Results({ q }) {
  const res = await fetch(process.env.API_URL + '/api/shows/search?q=' + encodeURIComponent(q));

  // If our API sends back an error, throw one so an error screen can show it
  if (!res.ok) {
    throw new Error('Search failed');
  }

  const shows = await res.json();

  // Empty state: a message when nothing matches
  if (shows.length === 0) {
    return <p>No shows found for {q}.</p>;
  }

  return (
    <ul>
      {shows.map((show) => {
                // The API sends the premiere date, like 2022-06-23. We show only the first 4 characters, the year.
                let year = '';
                if (show.premiered) {
                  year = ' (' + show.premiered.slice(0, 4) + ')';
                }

        return (
          // key tells React which item is which when the list changes
          <li key={show.id}>
            <Link href={'/shows/' + show.id}>{show.name}</Link>
            {year}
          </li>
        );
      })}
    </ul>
  );
}

// In Next.js 16, searchParams is a promise (like params), so await it before reading q.
// q is the text after ?q= in the address, for example /search?q=bear
export default async function SearchPage({ searchParams }) {
  const routeParams = await searchParams;

  let query = '';
  if (typeof routeParams.q === 'string') {
    query = routeParams.q.trim();
  }

  // Only search when the user typed something. Suspense shows "Searching..." while it loads.
  let results = null;
  if (query) {
    results = (
      <Suspense fallback={<p>Searching...</p>}>
        <Results q={query} />
      </Suspense>
    );
  }

  return (
    <>
      <h1>Search</h1>

      {/* A plain form. Clicking Search goes to /search?q=whatever-you-typed. */}
      <form action="/search">
        <input type="text" name="q" defaultValue={query} placeholder="Search for a show" />
        <button type="submit">Search</button>
      </form>

      {results}
    </>
  );
}