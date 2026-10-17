import { HttpError } from "./errors.js";

// This checks if the data is valid
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) { // If the data is invalid, it gets the field names and error messages
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    // This returns a 400 error with the details
    throw new HttpError(400, "Validation failed", details);
  }

  // This returns the vaild data
  return result.data;
}