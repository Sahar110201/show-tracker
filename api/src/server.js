// App entry point: creates the Express server, wires up the routes and
// error handlers, and starts listening for requests.
import express from "express";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import commentsRouter from "./routes/comments.js";
import showsRouter from "./routes/shows.js";

const app = express();
app.use(express.json());

app.use("/api/comments", commentsRouter);
app.use("/api/shows", showsRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`Show Tracker API running at http://localhost:${PORT}`);
});
