const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(404).json({ message: "No Token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    if(err.message=="twt expired"){
      res.status(401).json({ message: "Invalid token" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
