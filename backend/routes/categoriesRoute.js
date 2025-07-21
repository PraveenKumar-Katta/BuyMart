const express=require("express")
const { createCategory, getCategories, getcatItems } = require("../controllers/categoryController")


const categoryRoute=express.Router()

categoryRoute.get("/",getCategories)
categoryRoute.post("/",createCategory)
categoryRoute.get('/:id',getcatItems )


module.exports=categoryRoute