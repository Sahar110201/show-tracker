import Link from "next/link";

export const metadata = {
  title: "Watchlist",
};

// The statuses the API accepts. The empty one means "do not filter at all".
const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "plan_to_watch", label: "Plan to watch" },
  { value: "watching", label: "Watching" },
  { value: "finished", label: "Finished" },
  { value: "dropped", label: "Dropped" },
];

// The API only sorts by these fields and answers 400 for anything else.
const sortOptions = [
  { value: "name", label: "Name (A to Z)" },
  { value: "status", label: "Status" },
  { value: "rating", label: "Rating (lowest first)" },
  { value: "episodesWatched", label: "Episodes watched (fewest first)" },
];

// Reads the choices out of the address, for example /watchlist?status=watching&page=2.
// Anything we do not recognise falls back to the default, so a hand typed address
// cannot make the API answer with a 400.
function readChoices(params) {
  let status = "";
  if (statusOptions.some((option) => option.value === params.status)) {
    status = params.status;
  }

  let sort = "name";
  if (sortOptions.some((option) => option.value === params.sort)) {
    sort = params.sort;
  }

  let page = Number(params.page);
  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  return { status, sort, page };
}

// Turns the choices into a query string like "status=watching&sort=name&page=2".
// The page address and the API request both use it, so they cannot drift apart.
function buildQuery(choices) {
  const query = new URLSearchParams();

  if (choices.status) {
    query.set("status", choices.status);
  }

  query.set("sort", choices.sort);
  query.set("page", String(choices.page));

  return query.toString();
}

// The address of this page with the choices in it, which is what the Previous and
// Next links use. Keeping the choices in the address means a reload, the back
// button and a shared link all show the same page.
function watchlistHref(choices) {
  return "/watchlist?" + buildQuery(choices);
}

// Function that fetches the watchlist from our Express API
async function getWatchlist(choices) {
  const res = await fetch(
    process.env.API_URL + "/api/watchlist?" + buildQuery(choices),
    {
      cache: "no-store",
    }
  );

  // If API requests fail, the error code would display
  if (!res.ok) {
    throw new Error("Could not load watchlist");
  }

  const data = await res.json();
  const items = data.items;

  // For each item in the watchlist, it will show the name of the show and its details.
  const itemsWithShows = await Promise.all(
    items.map(async (item) => {
      try {
        const showRes = await fetch( process.env.API_URL + "/api/shows/" + item.tvmazeId
        );

        if (!showRes.ok) {
          return {
            ...item,
            showName: item.name,
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
          showName: item.name,
        };
      }
    })
  );

  return { items: itemsWithShows, total: data.total, pages: data.pages };
}


// Watchlist page
// In Next.js 16 searchParams is a promise, so it has to be awaited before reading.
export default async function WatchlistPage({ searchParams }) {
  const params = await searchParams;
  const choices = readChoices(params);

  const { items, total, pages } = await getWatchlist(choices);

  // The last page, used to turn the Next button off. An empty list still has one page.
  let lastPage = pages;
  if (!lastPage || lastPage < 1) {
    lastPage = 1;
  }

  let countLabel = total + " shows";
  if (total === 1) {
    countLabel = "1 show";
  }

  // A plain form, like the search page. Picking a status or a sort and clicking
  // Apply goes to /watchlist?status=...&sort=...&page=1, so the address always
  // matches what is on screen.
  const controls = (
    <form action="/watchlist" className="list-controls">
      <label>
        Status
        <select name="status" defaultValue={choices.status}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sort by
        <select name="sort" defaultValue={choices.sort}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {/* A new filter starts from the first page again */}
      <input type="hidden" name="page" value="1" />

      <button type="submit">Apply</button>
    </form>
  );

  // Previous and Next are links, not buttons, so they change the address.
  // On the first and last page they are plain text instead, because there is
  // nowhere to go.
  // A page number typed into the address can be past the end, so Previous goes
  // back to the last page that has shows on it rather than one empty page back.
  let previous = <span className="page-link-off">Previous</span>;
  if (choices.page > 1) {
    const previousPage = Math.min(choices.page - 1, lastPage);

    previous = (
      <Link href={watchlistHref({ ...choices, page: previousPage })}>
        Previous
      </Link>
    );
  }

  let next = <span className="page-link-off">Next</span>;
  if (choices.page < lastPage) {
    next = (
      <Link href={watchlistHref({ ...choices, page: choices.page + 1 })}>
        Next
      </Link>
    );
  }

  // What goes between the controls and the Previous/Next buttons
  let list = null;
  if (items.length === 0 && total > 0) {
    list = <p>That page is empty. Go back to an earlier page.</p>;
  } else if (items.length === 0 && choices.status) {
    list = <p>No shows with that status. Try a different one.</p>;
  } else if (items.length === 0) {
    list = <p>No shows in your watchlist.</p>;
  } else {
    list = (
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.showName}</strong>

            <br />

            TVMaze ID: {item.tvmazeId}

            <br />

            Status: {item.status.replaceAll("_", " ")}

            <br />

            Episodes Watched: {item.episodesWatched}

            <br />

            Rating: {item.rating}

            <br />

            <Link href={`/watchlist/${item.id}/edit`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
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

      {controls}

      <p className="subtitle">
        {countLabel} · page {choices.page} of {lastPage}
      </p>

      {list}

      <nav className="pagination">
        {previous}
        {next}
      </nav>
    </>
  );
}
