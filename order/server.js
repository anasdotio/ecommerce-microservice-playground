import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { connectToRabbitMQ } from "../Auth/src/broker/broker.js";

connectDB();
connectToRabbitMQ();
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
