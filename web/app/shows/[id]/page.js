import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Asks our Express API for one show. It runs on the server.
// It returns null when our API says the show does not exist.
async function getShow(id) {
  const res = await fetch(process.env.API_URL + '/api/shows/' + encodeURIComponent(id));

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Could not load the show');
  }

  return res.json();
}

// The episode list with air dates, grouped by season. It sits inside a Suspense below.
// Our API does not send episodes for every show, so this shows a message when there are none.
async function Episodes({ id }) {
    const show = await getShow(id);
  
    if (!show.episodes || show.episodes.length === 0) {
      return <p>The episode list is not available yet.</p>;
    }
  
    // Group the episodes by season, for example { 1: [...], 2: [...] }
    const seasons = {};
    for (const episode of show.episodes) {
      if (!seasons[episode.season]) {
        seasons[episode.season] = [];
      }
      seasons[episode.season].push(episode);
    }
  
    const seasonNumbers = Object.keys(seasons);
  
    return (
      <div>
        {seasonNumbers.map((season) => (
        // details is a box you click to open. All seasons start closed.
        <details key={season}>
            <summary>
              Season {season} ({seasons[season].length} episodes)
            </summary>
            <table>
              <tbody>
                {seasons[season].map((episode) => {
                  // Specials have no episode number, so we show a dash instead
                  let number = '-';
                  if (episode.number) {
                    number = episode.number;
                  }
  
                  // Not every episode has an air date
                  let airdate = '';
                  if (episode.airdate) {
                    airdate = episode.airdate;
                  }
  
                  return (
                    <tr key={episode.id}>
                      <td>{number}</td>
                      <td>{episode.name}</td>
                      <td>{airdate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </details>
        ))}
      </div>
    );
  }
// The folder name [id] makes this a dynamic route: /shows/54198 gives id === '54198'.
export default async function ShowPage({ params }) {
    // In Next.js 16 params is a promise, so await it before reading id.
    const routeParams = await params;
    const id = routeParams.id;
  
    // Load the show first, at the top of the page
    const show = await getShow(id);
  
    if (!show) {
      // Stops rendering this page and shows app/not-found.js instead.
      notFound();
    }
  
    // Not every show has every fact. Only show the ones we have.
    let genres = null;
    if (show.genres && show.genres.length > 0) {
      genres = (
        <p className="tags">
          {show.genres.map((genre) => (
            <span key={genre} className="tag">
              {genre}
            </span>
          ))}
        </p>
      );
    }
  
    let image = null;
    if (show.image) {
      image = <img src={show.image} alt={'Poster for ' + show.name} />;
    }
  
    let rating = null;
    if (show.rating) {
      rating = <span className="rating">★ {show.rating}</span>;
    }
  
    let status = null;
    if (show.status) {
      status = <span className="pill">{show.status}</span>;
    }
  
    let premiered = null;
    if (show.premiered) {
      premiered = <span className="pill">Premiered {show.premiered}</span>;
    }
  
    let summary = null;
    if (show.summary) {
      summary = <p className="summary">{show.summary}</p>;
    }
  
    return (
      <article>
        <p>
          <Link href="/search" className="back">
            ← Back to search
          </Link>
        </p>
  
        {/* Banner: poster on the left, show information on the right */}
        <section
        className="hero"
        style={{ '--poster': show.image ? 'url(' + show.image + ')' : 'none' }}>
          {image}
          <div className="hero-info">
            <h1>{show.name}</h1>
            <p className="badges">
              {rating}
              {status}
              {premiered}
            </p>
            {genres}
            {summary}
          </div>
        </section>
  
        <h2>Episodes</h2>
        {/* While the episodes load, Suspense shows this message */}
        <Suspense fallback={<p>Loading episodes...</p>}>
          <Episodes id={id} />
        </Suspense>
  
        {/* The comments section goes here (Person 2's part) */}
      </article>
    );
  }