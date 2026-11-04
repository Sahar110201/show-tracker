import Link from "next/link";

// Function that fetches the watchlist from our Express API
async function getWatchlist() {
  const res = await fetch(
    process.env.API_URL + "/api/watchlist",
    {
      cache: "no-store",
    }
  );

  // If API requests fail, the error code would display
  if (!res.ok) {
    throw new Error("Could not load watchlist");
  }

  const items = await res.json();

  // For each item in the watchlist, it will show the name of the show and its details.
  const itemsWithShows = await Promise.all(
    items.map(async (item) => {
      try {
        const showRes = await fetch( process.env.API_URL + "/api/shows/" + item.tvmazeId
        );

        if (!showRes.ok) {
          return {
            ...item,
            showName: "Unknown Show",
          };
        }

        const show = await showRes.json();

        return {
          ...item,
          showName: show.name,
        };
      } catch {
        return {
          ...item,
          showName: "Unknown Show",
        };
      }
    })
  );

  return itemsWithShows;
}


// Watchlist page
export default async function WatchlistPage() {
  const items = await getWatchlist();

  if (items.length === 0) {
    return (
      <>
        <h1>Watchlist</h1>
        <p>No shows in your watchlist.</p>
      </>
    );
  }

  return (
    <>
      <h1>Watchlist</h1>

      <p>
        <Link href="/add">
          Add show
        </Link>
      </p>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.showName}</strong>

            <br />

            TVMaze ID: {item.tvmazeId}

            <br />

            Status: {item.status.replaceAll("_", " ")}

            <br />

            Rating: {item.rating}

            <br />

            <Link href={`/watchlist/${item.id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}