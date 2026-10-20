// Controller for the shows routes: handles search and show-details requests,
// checking the cache before calling TVmaze and returning the results as JSON.
import { searchShows, getShow } from "../services/tvmaze.js";
import { getCache, setCache } from "../utils/cache.js";

// Searches shows by the ?q= query: validates it, returns a cached result if
// available, otherwise fetches from TVmaze, caches it, and returns the matches.
export async function search(req, res) {
  const q = req.query.q;

  if (typeof q !== "string" || q.trim() === "") {
    return res.status(400).json({ error: "Missing q" });
  }

  const key = "search:" + q.trim().toLowerCase();
  const cached = getCache(key);
  if (cached) return res.json(cached);

  try {
    const shows = await searchShows(q.trim());
    setCache(key, shows);
    res.json(shows);
  } catch (error) {
    res.status(error.status || 502).json({ error: error.message });
  }
}

// Fetches one show by its numeric :id: validates the id, returns a cached
// result if available, otherwise fetches from TVmaze, caches it, and returns it.
export async function details(req, res) {
  const id = req.params.id;

  if (!/^\d+$/.test(id)) {
    return res.status(404).json({ error: "Show not found" });
  }

  const key = "show:" + id;
  const cached = getCache(key);
  if (cached) return res.json(cached);

  try {
    const show = await getShow(id);
    setCache(key, show);
    res.json(show);
  } catch (error) {
    res.status(error.status || 502).json({ error: error.message });
  }
}
