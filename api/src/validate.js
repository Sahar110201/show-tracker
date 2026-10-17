import { HttpError } from "./errors.js";

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new HttpError(400, "Validation failed", details);
  }
  return result.data;
}