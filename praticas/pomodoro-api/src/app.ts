import express from "express";
import cors from "cors";
import { settingsRouter } from "./routes/settings.routes.js";
import { tasksRouter } from "./routes/task.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/settings", settingsRouter);
app.use("/tasks", tasksRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
