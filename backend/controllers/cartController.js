const cartModel = require("../models/cartModel");

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await cartModel.findOne({ userId }).populate("items.product");
    if(!cart){
      await cartModel.create({
      userId,
      items: [],
    });
    }
    res.status(200).json({cart});
  } catch (err) {
    console.error("Get Cart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Add/Update item
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (index >= 0) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    console.error("Add to Cart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than zero" });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update Cart Item Error:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// Remove item
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await cartModel.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ cart });
  } catch (err) {
    console.error("Remove Item Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
