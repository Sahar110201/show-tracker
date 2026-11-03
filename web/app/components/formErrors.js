// Our API answers a bad form with a 400 that looks like this:
// { error: { message: "Validation failed", details: [{ field: "text", message: "..." }] } }
// This turns that into a simple object like { text: "Too short" } so a form can
// print the message next to the right box.
export function getFieldErrors(body) {
  const errors = {};

  // Some errors have no details, for example a 404
  if (!body || !body.error || !body.error.details) {
    return errors;
  }

  for (const detail of body.error.details) {
    errors[detail.field] = detail.message;
  }

  return errors;
}
