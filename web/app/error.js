"use client";
// Error component that displays an error message when the API is not working
export default function Error({ error, reset,}) 
{
  return (
    <section>
      <h1>Something went wrong</h1>

      <p> The API may be unavailable.</p>

      <button onClick={() => reset()}> Try again </button>
    </section>
  );
}