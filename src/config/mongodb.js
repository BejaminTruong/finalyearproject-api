import { MongoClient } from "mongodb";
import { env } from "*/config/environment";

let dbInstance = null;

export const connectDB = async () => {
  const client = new MongoClient(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  await client.connect();
  dbInstance = client.db(env.DATABASE_NAME);
};

export const getDB = async () => {
  if (!dbInstance) throw new Error("Must connect to Database first!");
  return dbInstance;
};
