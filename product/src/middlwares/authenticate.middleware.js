import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    console.log(token);

    if (!token)
      return res.status(401).json({ message: "Authorized token not found" });

    const decoded = jwt.verify(token, "secret");
    console.log(decoded);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
