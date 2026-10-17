import { HttpError } from "../errors.js";

// This handles the requests to routes that do not exist
export function notFound(req, res, next) {
    // This sends a 404 error with the requested routes
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// This handles error in the app
export function errorHandler(err, req, res, next) {
    // This uses the error status or default to 500
  const status = err.status || 500;

  // This log server errors to the console
  if (status >= 500) console.error(err);

  // This sends the error response as JSON
  res.status(status).json({
    error: {
        // This hides the internal error message for the server errors
      message: status >= 500 ? "Internal server error" : err.message,

      // This includes the extra details or null if non of it exist
      details: err.details ?? null,
    },
  });
}