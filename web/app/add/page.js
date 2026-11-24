"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Form that allows a person to add a show to the watchlist
export default function AddPage() {
  const router = useRouter();
  const [tvmazeId, setTvmazeId] = useState("");
  const [status, setStatus] = useState("plan_to_watch");
  const [episodesWatched, setEpisodesWatched] = useState("0");
  const [rating, setRating] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const showResponse = await fetch("/api/shows/" + tvmazeId);

      if (!showResponse.ok) {
        setError("Show could not be found.");
        setSaving(false);
        return;
      }

      const show = await showResponse.json();

      const data = {
        tvmazeId: Number(tvmazeId),
        name: show.name,
        status,
        episodesWatched: Number(episodesWatched),
      };

      if (rating !== "") {
        data.rating = Number(rating);
      }

      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify(data),
      });

      const body = await response.json();

      if (!response.ok) {
        if (body.error && body.error.details) {
          const messages = Object.values(body.error.details);

          if (messages.length > 0) {
            setError(messages[0]);
          } else {
            setError("Could not save show.");
          }
        } else if (body.error && body.error.message) {
          setError(body.error.message);
        } else {
          setError("Could not save show.");
        }

        setSaving(false);
        return;
      }

      // Goes back to the watchlist after saving
      router.push("/watchlist");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Could not save show.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1>Add Show</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label>
            TVMaze ID
            <br />
            <input
              type="number"
              value={tvmazeId}
              onChange={(e) => setTvmazeId(e.target.value)}
              required
            />
          </label>
        </p>

        <p>
          <label>
            Status
            <br />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="plan_to_watch"> Plan to watch </option>
              <option value="watching"> Watching </option>
              <option value="finished"> Finished </option>
              <option value="dropped"> Dropped</option>
            </select>
          </label>
        </p>

        <p>
          <label> Episodes Watched
            <br />
            <input
              type="number"
              min="0"
              value={episodesWatched}
              onChange={(e) => setEpisodesWatched(e.target.value)}
              required
            />
          </label>
        </p>

        <p>
          <label> Rating
            <br />
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </label>
        </p>

        {error && <p className="field-error">{error}</p>}

        <button type="submit" disabled={saving} > {saving ? "Saving..." : "Add Show"} </button>
      </form>
    </>
  );
}