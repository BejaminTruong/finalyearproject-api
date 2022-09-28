import express from "express";
import { connectDB } from "*/config/mongodb";
import { env } from "*/config/environment";
import { apiV1 } from "*/routes/v1";

connectDB()
  .then(() => console.log("Connected successfully to database server!"))
  .then(() => bootServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const bootServer = () => {
  const app = express();

  app.use(express.json());

  app.use("/v1", apiV1);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Connected to ${env.APP_HOST} at PORT:${env.APP_PORT}`);
  });
};
