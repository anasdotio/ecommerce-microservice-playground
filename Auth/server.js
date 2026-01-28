import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { connectToRabbitMQ } from "./src/broker/broker.js";

connectDB();
connectToRabbitMQ();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
