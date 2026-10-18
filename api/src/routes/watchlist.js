import { Router } from "express";
import { listWatchlist, getWatchlistItem, addWatchlistItem, updateWatchlistItem, deleteWatchlistItem,} from "../controllers/watchlistlogic.js";

const router = Router();

// This will get all watchlist items
router.get("/", listWatchlist);

// This will get one watchlist item by ID
router.get("/:id", getWatchlistItem);

// This will add a new watchlist item
router.post("/", addWatchlistItem);

// This will update a watchlist item by ID
router.put("/:id", updateWatchlistItem);

// This will delete a watchlist item by ID
router.delete("/:id", deleteWatchlistItem);

export default router;
