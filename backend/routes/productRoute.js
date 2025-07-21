const express = require("express");
const productRoute = express.Router();
const auth = require("../middlewares/auth");
const authorization = require("../middlewares/authorization");
const { getProducts, addProduct, updateProduct, deleteProduct, getProduct } = require("../controllers/productController");

productRoute.get("/get-products",getProducts);
productRoute.get("/:id",getProduct)
productRoute.post("/add-product",auth,authorization(["admin","vendor"]),addProduct);
productRoute.put("/update-product/:id",auth,authorization(["admin","vendor"]),updateProduct);
productRoute.delete("/delete-product/:id",auth,authorization(["admin","vendor"]),deleteProduct);

module.exports = productRoute;
