import express from "express";
import { notFound, errorHandler } from "./middleware/errorHandlers.js";
import commentsRouter from "./routes/comments.js";

const app = express();
app.use(express.json());

app.use("/api/comments", commentsRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});