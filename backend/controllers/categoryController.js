const categoriesModel = require("../models/categoryModel")
const ProductModel = require("../models/productModel")

const getCategories=async(req,res)=>{
    try {
        let categories=await categoriesModel.find()
        res.status(200).json({message:"Categories",categories})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const createCategory=async(req,res)=>{
    let {title,img}=req.body
    try {
        await categoriesModel.create({title,img})
        res.status(200).json({message:"category Added"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const getcatItems=async (req, res) => {
  const id= req.params.id
  try {
    const products = await ProductModel.find({ category: id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category products" });
  }
}

module.exports={getCategories,createCategory,getcatItems}