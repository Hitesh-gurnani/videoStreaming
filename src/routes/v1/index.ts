import express, { Request, Response } from "express";
import videoRouter from "./video.routes";

const v1Router = express.Router();
v1Router.use("/videos", videoRouter);
v1Router.get("/ping", (_: Request, res: Response) => {
  res.json({ message: "pong!" });
});

export default v1Router;
