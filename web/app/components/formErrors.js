// Our API answers a bad form with a 400 that looks like this:
// { error: { message: "Validation failed", details: { text: "Too short", rating: "Must be 1 to 5" } } }
// (The M2 version sent a list instead: details: [{ field: "text", message: "..." }].)
// This turns either one into a simple object like { text: "Too short" } so a form can
// print the message next to the right box.
export function getFieldErrors(body) {
  const errors = {};

  // Some errors have no details for example the 404
  if (!body || !body.error || !body.error.details) {
    return errors;
  }

  const details = body.error.details;

  // A list of { field, message } items
  if (Array.isArray(details)) {
    for (const detail of details) {
      errors[detail.field] = detail.message;
    }
    return errors;
  }

  // An object like { field: message }, which is what the Mongoose error handler sends
  for (const field in details) {
    errors[field] = details[field];
  }

  return errors;
}