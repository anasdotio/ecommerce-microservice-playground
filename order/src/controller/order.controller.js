import axios from "axios";
import orderModel from "../model/order.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { publishToQueue } from "../broker/broker.js";

export const createOrder = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log(req.headers);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "secret");

    if (!decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { products } = req.body;

  const productDetails = await Promise.all(
    products?.map(
      async (product) =>
        (await axios.get(`http://localhost:3001/products/${product.productId}`))
          .data,
    ),
  );

  let totalAmount = 0;
  const orderItems = products.map((item) => {
    const product = productDetails.find((p) => p._id === item.id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < item.quantity) {
      throw new Error("Product out of stock");
    }

    totalAmount += item.quantity * item.price;

    console.log(product);

    return {
      productId: product.product._id,
      quantity: item.quantity,
      price: item.price,
    };
  });

  const order = await orderModel.create({
    userId: req.user.id,
    products: orderItems,
    totalAmount,
  });

  await publishToQueue("ORDER_NOTIFICATION.ORDER_CREATED", order);  

  res.status(201).json({ success: true, data: order });
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ success: false, message: "Order id is required" });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order id" });
    }

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Order cannot be canceled" });
    }

    order.status = "canceled";
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
