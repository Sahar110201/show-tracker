import dns from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers([ "1.1.1.1", "8.8.8.8",]);
mongoose.set("sanitizeFilter", true);

export async function connectDb() {

  const uri = process.env.MONGODB_URI;


  if (!uri) {
    console.error( "MONGODB_URI is not currently set. Copy .env.example to .env and put your connection string in it to work");
    process.exit(1);
  }


  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error(
      "Could not connect to MongoDB " + error.message);

    process.exit(1);
  }


  console.log(
    'Connected to MongoDB, database "' + mongoose.connection.name + '"');
}
