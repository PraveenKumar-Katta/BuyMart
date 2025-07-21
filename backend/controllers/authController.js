const userModel = require("../models/userModel");
let jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let saltRounds = 10;
const signupUser = async (req, res) => {
  let { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Incomplete User Information" });
  }
  try {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (hash) {
        await userModel.create({ name, email, password: hash, role });
        res.status(200).json({ message: "Registation Sucessful" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Incomplete User Information" });
  }
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Registered" });
    }
    let hashed = user.password;
    bcrypt.compare(password, hashed, async function (err, result) {
      if (!result) {
        return res.status(403).json({ message: "Invalid Credientials" });
      }
      let token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.status(200).json({
        message: "Login Sucess!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
