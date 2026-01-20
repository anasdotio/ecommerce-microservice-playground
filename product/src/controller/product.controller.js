import productModel from "../model/product.model.js";

export const createProduct = async (req, res, next) => {
  const { title, description, price, stock } = req.body;

  const product = new productModel({
    userId: req.user.id,
    title,
    description,
    price,
    stock,
  });

  await product.save();

  res
    .status(201)
    .json({ success: true, product, message: "Product created successfully" });
};

export const getProducts = async (req, res, next) => {
  const products = await productModel.find({});

  if (!products) {
    return res.status(404).json({ message: "Products not found" });
  }

  if (products.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }

  res.status(200).json({
    success: true,
    products,
    message: "Products fetched successfully",
  });
};

export const getProductById = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
};
