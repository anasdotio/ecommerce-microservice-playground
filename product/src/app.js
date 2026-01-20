import express from "express";
import morgan from "morgan";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/products", productRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

export default app;
