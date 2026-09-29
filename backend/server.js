const express=require("express")
const connectDB = require("./configs/db")
const authRoute = require("./routes/authRoute")
const cors = require('cors');
const categoryRoute = require("./routes/categoriesRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
require("dotenv").config()
const app=express()
app.use(express.json())

app.use(
  cors({
    origin: "https://buymart-shop.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB()
let PORT=process.env.PORT

app.use("/auth",authRoute)
app.use("/categories",categoryRoute)
app.use("/products", productRoute);
app.use("/orders",orderRoute)
app.use("/cart",cartRoute)



app.listen(PORT,()=>{
    console.log("Server Is Running on Port",PORT)
})
