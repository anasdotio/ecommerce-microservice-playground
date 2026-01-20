import axios from "axios";
import orderModel from "../model/order.model.js";
import jwt from "jsonwebtoken";

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

  res.status(201).json({ success: true, data: order });
};
