import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { router } from "./routes";
import cors from "cors";
import "./config/passport";
import { jwtMiddleware } from "./middleware/jwtMiddleware";

const main = async () => {
  dotenv.config();

  // create database connection
  await createConnection({
    type: "postgres",
    url: process.env.ELEPHANT_URL,
    synchronize: true,
    // logging: true,
    entities: ["dist/database/src/entities/**/*.js"],
    cli: {
      entitiesDir: "src/entities",
    },
  });

  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://www.trackntrace.network"],
      credentials: true,
    })
  );

  // log http requests
  app.use(morgan("dev"));

  // json body parser
  app.use(express.json());

  app.use("/api", jwtMiddleware, router);

  // custom error handler
  app.use(
    (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      res.status(error.status || 500);
      res.json({
        status: error.status || 500,
        message: error.message,
      });
    }
  );

  app.listen(process.env.PORT || 8001, () => {
    console.log(
      `[server] Server is running on Port ${process.env.PORT || 8001}`
    );
  });
};

main().catch((error) => console.error(error));
