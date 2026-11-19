
import mongoose from "mongoose";

// Protect against query selector injection.
mongoose.set("sanitizeFilter", true);

// Connects to the database in MONGODB_URI.
export async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "MONGODB_URI is not set. Copy .env.example to .env and put your connection string in it."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error("Could not connect to MongoDB: " + error.message);
    process.exit(1);
  }

  console.log(
    'Connected to MongoDB, database "' +
      mongoose.connection.name +
      '"'
  );
}
