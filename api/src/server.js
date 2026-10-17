import express from "express";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import commentsRouter from "./routes/comments.js";

const app = express(); // This creates the Express App
app.use(express.json()); // This allows the app to read the JSON data

app.use("/api/comments", commentsRouter); // This sets up the comments routes

app.use(notFound); // This allows to handle requests to routes that do not exist
app.use(errorHandler); // This handles the errors in the app

const PORT = process.env.PORT ?? 4000; // This sets the port and use 4000 

app.listen(PORT, () => { // This starts the server
  console.log(`Show Tracker API running at http://localhost:${PORT}`);
});