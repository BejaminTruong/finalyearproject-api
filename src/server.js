import express from "express";
import { connectDB } from "*/config/mongodb";
// import { env } from "*/config/environment";
import { apiV1 } from "*/routes/v1";
import cors from "cors";
import { corsOptions } from "*/config/cors";
import { Middleware } from "*/middlewares";
import { unless } from "express-unless";

connectDB()
  .then(() => console.log("Connected successfully to database server!"))
  .then(() => bootServer())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const bootServer = () => {
  const app = express();

  app.use(cors(corsOptions));

  app.use(express.json());

  Middleware.verifyToken.unless = unless;

  app.use(
    Middleware.verifyToken.unless({
      path: [
        { url: "v1/users/login", method: ["POST"] },
        { url: "v1/users/register", method: ["POST"] },
      ],
    })
  );

  app.use("v1", apiV1);

  //For dev:
  // app.listen(env.APP_PORT, env.APP_HOST, () => {
  //   console.log(`Connected to ${env.APP_HOST} at PORT:${env.APP_PORT}`);
  // });

  //For deploy to heroku:
  app.listen(process.env.PORT, () => {
    console.log(`I'm running at PORT:${process.env.PORT}`);
  });
};
