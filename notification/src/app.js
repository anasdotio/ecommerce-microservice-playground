import express from "express";
import { subscribeToQueue, connectToRabbitMQ } from "./broker/broker.js";
import listner from "./broker/listner.js";
const app = express();

connectToRabbitMQ().then(() => {
  listner();
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Notification service is running",
  });
}); 

export default app;
