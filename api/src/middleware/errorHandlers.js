import mongoose from "mongoose";
import { HttpError } from "../errors.js";

// This handles requests to routes that do not exist.
export function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// This handles errors in the app.
export function errorHandler(err, req, res, next) {
  // If a response has already started, pass the error on.
  if (res.headersSent) return next(err);

  // The request body was not valid JSON.
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: { message: "Request body must be valid JSON", details: null },
    });
  }

  // The schema rejected the data. err.errors has one entry per field
  // that broke a validation rule.
  if (err instanceof mongoose.Error.ValidationError) {
    const details = {};

    for (const field in err.errors) {
      details[field] = err.errors[field].message;
    }

    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: details,
      },
    });
  }

  // The supplied value could not be converted to the expected type.
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: {
        message: "Invalid value",
        details: {
          [err.path]: err.message,
        },
      },
    });
  }

  // A unique index was broken for example the same entry added twice.
  if (err.code === 11000) {
    return res.status(409).json({
      error: { message: "That entry already exists", details: null },
    });
  }

  // This uses the error status or defaults to 500.
  const status = err.status ?? 500;

  // Log server errors to the console.
  if (status >= 500) console.error(err);

  // Send the error response as JSON.
  res.status(status).json({
    error: {
      message: status >= 500 ? "Internal server error" : err.message,
      details: err.details ?? null,
    },
  });
}