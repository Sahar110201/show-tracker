import { Router } from "express";

// Importing the functions that jandle comment requests
import {
  listComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.js";

// This creates a router for comment routes
const router = Router();

// This gets all the comments. ?tvmazeId= or ?watchlistItem= narrows the list down.
router.get("/", listComments);

// This gets 1 comment by ID, with the watchlist item it belongs to included
router.get("/:id", getComment);

// This creates a new comment
router.post("/", createComment);

// This updates the comment by ID
router.put("/:id", updateComment);

// This deletes a comment by ID
router.delete("/:id", deleteComment);

// This exports the router so that other files can use it as well
export default router;