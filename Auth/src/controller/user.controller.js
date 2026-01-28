import { publishToQueue } from "../broker/broker.js";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
export const createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = await userModel.create({
    fullName,
    email,
    password,
    role,
  });

  await publishToQueue("AUTH_NOTIFICATION.USER_CREATED", {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  });

  const token = jwt.sign({ id: user._id, role: user.role }, "secret", {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
    token,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, "secret", {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "User created successfully",
    data: user,
    token,
  });
};

export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User created successfully",
    data: req.user,
  });
};
