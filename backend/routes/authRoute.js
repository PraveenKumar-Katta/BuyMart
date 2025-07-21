const express=require("express")
const { loginUser, signupUser } = require("../controllers/authController")

const authRoute=express.Router()

authRoute.post("/signup",signupUser)
authRoute.post("/login",loginUser)


module.exports=authRoute