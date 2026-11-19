import mongoose from "mongoose";
import { connectDb } from "../src/db.js";
import { WatchlistItem } from "../src/models/WatchlistItem.js";
import { Comment } from "../src/models/Comment.js";

// These are 28 sample shows. The tvmazeId is the show's id on TVmaze so the detail page can load it and plan_to_watch items have no rating because nothing has been watched yet.
const shows = [
  { tvmazeId: 54198, name: "The Bear", status: "watching", episodesWatched: 4, rating: 4 },
  { tvmazeId: 63542, name: "Breaking Bear", status: "plan_to_watch", episodesWatched: 0 },
  { tvmazeId: 18005, name: "Little Bear", status: "finished", episodesWatched: 10, rating: 3 },
  { tvmazeId: 45807, name: "Paddington Bear", status: "dropped", episodesWatched: 2, rating: 2 },
  { tvmazeId: 66779, name: "Bossy Bear", status: "plan_to_watch", episodesWatched: 0 },
  { tvmazeId: 45100, name: "Man vs. Bear", status: "watching", episodesWatched: 3, rating: 3 },
  { tvmazeId: 19750, name: "Bear with Me", status: "finished", episodesWatched: 8, rating: 4 },
  { tvmazeId: 10169, name: "Goldie & Bear", status: "dropped", episodesWatched: 1, rating: 1 },
  { tvmazeId: 30331, name: "Blonde vs. Bear", status: "plan_to_watch", episodesWatched: 0 },
  { tvmazeId: 19068, name: "Polar Bear Town", status: "watching", episodesWatched: 5, rating: 4 },
  { tvmazeId: 169, name: "Breaking Bad", status: "finished", episodesWatched: 62, rating: 5 },
  { tvmazeId: 82, name: "Game of Thrones", status: "finished", episodesWatched: 73, rating: 4 },
  { tvmazeId: 139, name: "Girls", status: "dropped", episodesWatched: 6, rating: 2 },
  { tvmazeId: 1, name: "Under the Dome", status: "dropped", episodesWatched: 5, rating: 2 },
  { tvmazeId: 2, name: "Person of Interest", status: "watching", episodesWatched: 20, rating: 4 },
  { tvmazeId: 3, name: "Bitten", status: "plan_to_watch", episodesWatched: 0 },
  { tvmazeId: 4, name: "Arrow", status: "watching", episodesWatched: 12, rating: 3 },
  { tvmazeId: 5, name: "True Detective", status: "finished", episodesWatched: 8, rating: 5 },
  { tvmazeId: 6, name: "The 100", status: "dropped", episodesWatched: 9, rating: 2 },
  { tvmazeId: 66, name: "The Big Bang Theory", status: "finished", episodesWatched: 40, rating: 3 },
  { tvmazeId: 335, name: "Sherlock", status: "finished", episodesWatched: 13, rating: 5 },
  { tvmazeId: 431, name: "Friends", status: "watching", episodesWatched: 30, rating: 5 },
  { tvmazeId: 526, name: "The Office", status: "watching", episodesWatched: 50, rating: 5 },
  { tvmazeId: 2993, name: "Stranger Things", status: "finished", episodesWatched: 25, rating: 4 },
  { tvmazeId: 618, name: "Better Call Saul", status: "plan_to_watch", episodesWatched: 0 },
  { tvmazeId: 73, name: "The Walking Dead", status: "dropped", episodesWatched: 11, rating: 2 },
  { tvmazeId: 1371, name: "Westworld", status: "plan_to_watch", episodesWatched: 0 },
  { tvmazeId: 123, name: "Lost", status: "watching", episodesWatched: 15, rating: 4 },
];

await connectDb();

// Start from clean collections so running the script twice does not double the data.
const removedItems = await WatchlistItem.deleteMany({});
const removedComments = await Comment.deleteMany({});

// insertMany() runs the schema validation too so a typo in the data above fails.
const items = await WatchlistItem.insertMany(shows);

// Each comment points at a watchlist item by its _id. The number is the item's position in the list above.
const comments = [
  { item: 0, text: "Season 1 is stressful in the best way." },
  { item: 0, text: "The episode in one take had me on the edge of my seat." },
  { item: 2, text: "Nostalgic, I watched this as a kid." },
  { item: 6, text: "More relaxing than I expected." },
  { item: 10, text: "Still the best ending I have seen." },
  { item: 20, text: "Every episode keeps you guessing." },
  { item: 21, text: "Perfect comfort show." },
  { item: 22, text: "I quote this show far too often." },
];

const insertedComments = await Comment.insertMany(
  comments.map((comment) => ({
    text: comment.text,
    tvmazeId: items[comment.item].tvmazeId,
    watchlistItem: items[comment.item]._id,
  }))
);

// This makes each collection's indexes match its schema.
await WatchlistItem.syncIndexes();
await Comment.syncIndexes();

console.log(`Watchlist: removed ${removedItems.deletedCount}, inserted ${items.length}`);
console.log(`Comments: removed ${removedComments.deletedCount}, inserted ${insertedComments.length}`);

// Without this the script never ends because the open connection keeps the node running.
await mongoose.disconnect();