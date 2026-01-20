import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

export default app;
