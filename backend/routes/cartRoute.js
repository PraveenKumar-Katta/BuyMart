const express = require('express');
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');


const cartRoute = express.Router();

cartRoute.get("/:userId", getCart);

cartRoute.post("/add", addToCart);

cartRoute.put("/:userId/item/:productId", updateCartItem);

cartRoute.delete("/:userId/item/:productId", removeFromCart);


module.exports = cartRoute;
