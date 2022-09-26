import express from "express";
import { connectDB } from "*/config/mongodb";
import { env } from "*/config/environment";
import { BoardModel } from "*/models/board.model";

connectDB()
  .then(() => console.log("Connected successfully to database server!"))
  .then(() => bootServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const bootServer = () => {
  const app = express();

  app.get("/test", async (req, res) => {
    let fakeData = { title: "benjamintruong" };
    const newBoard = BoardModel.createNew(fakeData);
    console.log(newBoard);
    res.end("<h1>Hello world!</h1>");
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Connected to ${env.APP_HOST} at PORT:${env.APP_PORT}`);
  });
};
