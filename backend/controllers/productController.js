const cartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    await ProductModel.create(req.body);
    res
      .status(200)
      .json({ message: "Product Added Sucessfully", product: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getProduct = async (req, res) => {
  let id = req.params.id;
  try {
    let product = await ProductModel.findOne({ _id: id });
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    let products = await ProductModel.find();
    res.status(200).json({ message: "List of Products", products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  let productId = req.params.id;
  let productUpdate = req.body;
  try {
    let product = await ProductModel.findByIdAndUpdate(
      { _id: productId },
      productUpdate,
      { new: true }
    );
    res.status(200).json({ message: "Product Updated", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  let productId = req.params.id;
  console.log(productId);
  try {
    let product = await ProductModel.findByIdAndDelete({ _id: productId });
    await cartModel.updateMany(
      {},
      { $pull: { items: { product: productId } } }
    );
    res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
