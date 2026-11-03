export const metadata = {
  title: "Edit Watchlist Item",
};

export default function EditPage() {
  return (
    <>
      <h1>Edit Watchlist Item</h1>

      <form>
        <p>
          <label>
            Status
            <br />
            <select name="status">
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
            <input type="number"
              min="1"
              max="5"
              name="rating"/>
          </label>
        </p>

        <button type="submit"> Save </button>
      </form>
    </>
  );
}