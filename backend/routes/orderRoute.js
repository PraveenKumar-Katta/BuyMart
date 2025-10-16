const express=require("express")
const { getOrders, createOrder, updateOrder, deleteOrder } = require("../controllers/orderController")

const orderRoute=express.Router()

orderRoute.get("/",getOrders)
orderRoute.post("/",createOrder)
orderRoute.put("/:id",updateOrder)
orderRoute.delete("/:id",deleteOrder)

module.exports=orderRoute