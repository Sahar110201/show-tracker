// Talks to the external TVmaze API to search shows and fetch show details,
// with timeouts, error handling, and a simplified show shape for the app.
const TVMAZE = "https://api.tvmaze.com";
const TIMEOUT_MS = 5000; // give up after 5 seconds

// Makes a GET request to TVmaze with a timeout, and throws an error tagged
// with a status (404, 502, or 504) if the show is missing, fails, or times out.
async function askTvmaze(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(TVMAZE + path, { signal: controller.signal });

    if (response.status === 404) {
      const err = new Error("Show not found");
      err.status = 404;
      throw err;
    }

    if (!response.ok) {
      const err = new Error("TVmaze error");
      err.status = 502;
      throw err;
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      const err = new Error("TVmaze too slow");
      err.status = 504;
      throw err;
    }
    if (error.status) throw error;

    const err = new Error("Could not reach TVmaze");
    err.status = 502;
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Trims a full TVmaze show object down to the few fields the app needs,
// stripping HTML from the summary.
function simpleShow(show) {
  return {
    id: show.id,
    name: show.name,
    genres: show.genres,
    status: show.status,
    premiered: show.premiered,
    rating: show.rating ? show.rating.average : null,
    image: show.image ? show.image.medium : null,
    summary: show.summary ? show.summary.replace(/<[^>]*>/g, "") : "",
  };
}

// Searches TVmaze by name and returns a list of simplified shows.
export async function searchShows(q) {
  const results = await askTvmaze("/search/shows?q=" + encodeURIComponent(q));
  return results.map((item) => simpleShow(item.show));
}

// Fetches a single show by id and returns it in simplified form.
export async function getShow(id) {
  const show = await askTvmaze("/shows/" + id);
  return simpleShow(show);
}
