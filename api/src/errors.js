export class HttpError extends Error {
    // This creates an error 
    constructor(status, message, details = null) {
      super(message);// This sets the error message
      this.status = status; // This sets the status code
      this.details = details; // This ads details to the message
    }
  }