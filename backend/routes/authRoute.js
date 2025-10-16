const express=require("express")
const { loginUser, signupUser, updateUser } = require("../controllers/authController")

const authRoute=express.Router()

authRoute.post("/signup",signupUser)
authRoute.post("/login",loginUser)
authRoute.put("/update/:id",updateUser)



module.exports=authRoute