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

// The episode list with air dates. It sits inside a Suspense below.
// Our API does not send episodes yet, so this shows a message until it does.
async function Episodes({ id }) {
  const show = await getShow(id);

  if (!show.episodes || show.episodes.length === 0) {
    return <p>The episode list is not available yet.</p>;
  }

  return (
    <ol>
      {show.episodes.map((episode) => {
        // Not every episode has an air date. Only show it when there is one.
        let airdate = '';
        if (episode.airdate) {
          airdate = ' (aired ' + episode.airdate + ')';
        }

        return (
          <li key={episode.id}>
            Season {episode.season}, episode {episode.number}: {episode.name}
            {airdate}
          </li>
        );
      })}
    </ol>
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
  let genres = 'No genres listed';
  if (show.genres && show.genres.length > 0) {
    genres = show.genres.join(', ');
  }

  let image = null;
  if (show.image) {
    image = <img src={show.image} alt={'Poster for ' + show.name} width="210" />;
  }

  let premiered = null;
  if (show.premiered) {
    premiered = (
      <>
        <dt>Premiered</dt>
        <dd>{show.premiered}</dd>
      </>
    );
  }

  let status = null;
  if (show.status) {
    status = (
      <>
        <dt>Status</dt>
        <dd>{show.status}</dd>
      </>
    );
  }

  let rating = null;
  if (show.rating) {
    rating = (
      <>
        <dt>Rating</dt>
        <dd>{show.rating} / 10</dd>
      </>
    );
  }

  let summary = null;
  if (show.summary) {
    summary = <p>{show.summary}</p>;
  }

  return (
    <article>
      <p>
        <Link href="/search">Back to search</Link>
      </p>
      <h1>{show.name}</h1>
      {image}

      <dl>
        <dt>Genres</dt>
        <dd>{genres}</dd>
        {premiered}
        {status}
        {rating}
      </dl>

      {summary}

      <h2>Episodes</h2>
      {/* While the episodes load, Suspense shows this message */}
      <Suspense fallback={<p>Loading episodes...</p>}>
        <Episodes id={id} />
      </Suspense>

      {/* The comments section goes here (Person 2's part) */}
    </article>
  );
}