"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Form for editing an existing watchlist item
export default function EditPage() {
  const router = useRouter();
  const params = useParams();

  // Get the watchlist item ID from the URL
  const watchlistId = params.id;
  const [tvmazeId, setTvmazeId] = useState("");
  const [status, setStatus] = useState("plan_to_watch");
  const [rating, setRating] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(
        "/api/watchlist/" + watchlistId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tvmazeId: Number(tvmazeId),
            status,
            rating: Number(rating),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      router.push("/watchlist");
    } catch (error) {
      console.error(error);
      alert("Could not update watchlist item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1>Edit Watchlist Item</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label>
            TVMaze ID
            <br />
            <input
              type="number"
              value={tvmazeId}
              onChange={(e) => setTvmazeId(e.target.value)
              }
            />
          </label>
        </p>

        <p>
          <label>
            Status
            <br />
            <select
              value={status} onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="plan_to_watch">
                Plan to watch
              </option>

              <option value="watching">
                Watching
              </option>

              <option value="finished">
                Finished
              </option>

              <option value="dropped">
                Dropped
              </option>
            </select>
          </label>
        </p>

        <p>
          <label>
            Rating
            <br />
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
            />
          </label>
        </p>

        <button type="submit" disabled={saving} > {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </>
  );
}