"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Form that allows a person to add a show to the watchlist
export default function AddPage() {
  const router = useRouter();
  const [tvmazeId, setTvmazeId] = useState("");
  const [status, setStatus] = useState("plan_to_watch");
  const [rating, setRating] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify({
          tvmazeId: Number(tvmazeId),
          status,
          rating: Number(rating),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add show");
      }

      // Goes back to the watchlist after saving
      router.push("/watchlist");
    } catch (error) {
      console.error(error);
      alert("Could not save show.");
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
          <label> Rating
            <br />
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </label>
        </p>

        <button type="submit" disabled={saving} > {saving ? "Saving..." : "Add Show"} </button>
      </form>
    </>
  );
}