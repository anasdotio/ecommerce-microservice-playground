import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, "secret");

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = await userModel.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default authenticate;
