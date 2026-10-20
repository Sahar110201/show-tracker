import { HttpError } from "../errors.js";

// Watchlist data 
const watchlist = [
  { id: crypto.randomUUID(), tvmazeId: 169, status: "watching", rating: 5 },
  { id: crypto.randomUUID(), tvmazeId: 82, status: "finished", rating: 4 },
  { id: crypto.randomUUID(), tvmazeId: 200, status: "plan_to_watch", rating: 3 },
];

// a function to find a show by ID
function findIndexById(id) {
  let index = -1;

  for (let i = 0; i < watchlist.length; i++) {
    if (watchlist[i].id === id) {
      index = i;
    }
  }

  if (index === -1) {
    throw new HttpError(404, "Show not found");
  }

  return index;
}

// Validation
function validateWatchlistData(data) {
  
  if (typeof data.tvmazeId !== "number" || data.tvmazeId <= 0) {
    throw new HttpError(400, "tvmazeId must be a positive number");
  }

  // Check status and the ratings
  const allowedStatuses = ["plan_to_watch", "watching", "finished", "dropped"];
  if (!allowedStatuses.includes(data.status)) {
    throw new HttpError(400, "status is not valid");
  }


  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    throw new HttpError(400, "rating must be between 1 and 5");
  }
}

// This function will show all items
export function listWatchlist(req, res) {
  res.status(200).json(watchlist);
}

// This function will show one item
export function getWatchlistItem(req, res) {
  const index = findIndexById(req.params.id);
  res.status(200).json(watchlist[index]);
}

// This function will add a new item
export function addWatchlistItem(req, res) {
  const data = req.body;

  validateWatchlistData(data);

  const newItem = {
    id: crypto.randomUUID(),
    tvmazeId: data.tvmazeId,
    status: data.status,
    rating: data.rating,
  };

  watchlist.push(newItem);
  res.status(201).json(newItem);
}

// This function will update an item
export function updateWatchlistItem(req, res) {
  const index = findIndexById(req.params.id);
  const data = req.body;

  validateWatchlistData(data);

  const updatedItem = {
    id: watchlist[index].id,
    tvmazeId: data.tvmazeId,
    status: data.status,
    rating: data.rating,
  };

  watchlist[index] = updatedItem;
  res.status(200).json(updatedItem);
}

// This function will delete an item
export function deleteWatchlistItem(req, res) {
  const index = findIndexById(req.params.id);
  watchlist.splice(index, 1);
  res.status(204).send();
}
