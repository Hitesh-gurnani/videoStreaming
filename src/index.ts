import express, { Express } from "express";
import { PORT } from "./config/server.config";
import apiRouter from "./routes";
import cors from "cors";
const app: Express = express();

app.use("/api", apiRouter);
app.use(cors());

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
