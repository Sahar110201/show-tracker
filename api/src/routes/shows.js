// Defines the /api/shows routes and maps them to their controller functions.
import express from "express";
import { search, details } from "../controllers/shows.js";

const router = express.Router();

router.get("/search", search);
router.get("/:id", details);

export default router;
