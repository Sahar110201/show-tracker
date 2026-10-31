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
      <ul className="results">
        {shows.map((show) => {
          // Not every show has a rating, a date or genres, so each one has a fallback
                  // TVmaze rates out of 10. We fill the 5 stars to match, so 7.4 fills about 3.7 stars.
        let rating = <span className="rating-none">No rating</span>;
        if (show.rating) {
          const fill = Math.round((show.rating / 10) * 100);
          rating = (
            <span className="stars-row" role="img" aria-label={'Rating ' + show.rating + ' out of 10'}>
              <span className="stars" style={{ '--fill': fill + '%' }} aria-hidden="true">
                ★★★★★
              </span>
              <span className="rating-number">{show.rating}</span>
            </span>
          );
        }
  
          let date = 'Date unknown';
          if (show.premiered) {
            date = show.premiered;
          }
  
          let genres = 'No genres listed';
          if (show.genres && show.genres.length > 0) {
            genres = show.genres.join(', ');
          }
  
          // A short description: the first 180 characters of the summary
          let description = null;
          if (show.summary) {
            let text = show.summary;
            if (text.length > 180) {
              text = text.slice(0, 180).trimEnd() + '...';
            }
            description = <p className="result-description">{text}</p>;
          }
  
          // Not every show has a poster
          let poster = <div className="no-poster">No image</div>;
          if (show.image) {
            poster = <img src={show.image} alt={'Poster for ' + show.name} />;
          }
  
          return (
            // key tells React which row is which when the list changes
            <li key={show.id} className="result-row">
              {poster}
              <div className="result-body">
                <h2 className="result-name">{show.name}</h2>
                {rating}
                <p className="result-meta">
                  Premiered {date} · {genres}
                </p>
                {description}
              </div>
              <Link href={'/shows/' + show.id} className="view-button">
                View details
              </Link>
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
      <p className="subtitle">Find a TV show and see its details and episodes.</p>

      {/* A plain form. Clicking Search goes to /search?q=whatever-you-typed. */}
      <form action="/search">
        <input type="text" name="q" defaultValue={query} placeholder="Search for a show" />
        <button type="submit">Search</button>
      </form>

      {results}
    </>
  );
}