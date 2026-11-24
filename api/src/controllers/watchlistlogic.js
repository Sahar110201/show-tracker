import { HttpError } from "../errors.js";
import { WatchlistItem } from "../models/WatchlistItem.js";
import { findByIdOr404 } from "../utils/findById.js";


export async function listWatchlist(req, res) {


  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }


  const allowedSorts = ["name", "status", "rating", "episodesWatched"];

  let sort = "name";

  if (req.query.sort) {

    if (!allowedSorts.includes(req.query.sort)) {
      throw new HttpError(400, "Sort field is not valid");
    }

    sort = req.query.sort;
  }

  let page = Number(req.query.page);

  if (!page) {
    page = 1;
  }

  let limit = Number(req.query.limit);

  if (!limit) {
    limit = 10;
  }

  if (limit > 20) {
    limit = 20;
  }

  if (page < 1) {
    throw new HttpError(400, "Page must be at least 1");
  }

  if (limit < 1) {
    throw new HttpError(400, "Limit must be at least 1");
  }



  const skip = (page - 1) * limit;
  const items = await WatchlistItem.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);


  const total = await WatchlistItem.countDocuments(filter);
  const pages = Math.ceil(total / limit);


  res.status(200).json({ items: items, total: total, pages: pages });
}


export async function getWatchlistItem(req, res) {

  const item = await findByIdOr404( WatchlistItem, req.params.id );
  res.status(200).json(item);
}


export async function addWatchlistItem(req, res) {
  const data = req.body;

  const newItem = await WatchlistItem.create({
    tvmazeId: data.tvmazeId,
    name: data.name,
    status: data.status,
    episodesWatched: data.episodesWatched,
    rating: data.rating
  });
  res.status(201).json(newItem);
}



export async function updateWatchlistItem(req, res) {

  const data = req.body;
  const updatedItem = await WatchlistItem.findByIdAndUpdate(
    req.params.id,
    {
      tvmazeId: data.tvmazeId,
      name: data.name,
      status: data.status,
      episodesWatched: data.episodesWatched,
      rating: data.rating
    },

    {
      returnDocument: "after",
      runValidators: true
    }
  );



  if (!updatedItem) { 
    throw new HttpError(404, "Watchlist item not found");
  }

  res.status(200).json(updatedItem);
}


export async function deleteWatchlistItem(req, res) {


  const deletedItem = await WatchlistItem.findByIdAndDelete(
    req.params.id
  );

  if (!deletedItem) {
    throw new HttpError(404, "WatchlistItem not found");
  }


  res.status(204).send();
}