const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

// Create Order (User places order)
const createOrder = async (req, res) => {
  try {
    const { user, products, totalAmount, shippingAddress } = req.body;

  
    for (const item of products) {
      const product = await productModel.findById(item.product);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).send({
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    // 2. Deduct stock
    for (const item of products) {
      await productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 3. Save order with default orderStatus
    const order = await orderModel.create({
      user,
      products,
      totalAmount,
      shippingAddress,
      orderStatus: "Processing", // default
    });

    res.status(201).send({ message: "Order Placed", order });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get All Orders (Admin/Vendor view)
const getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("products.product")
      .populate("user", "name email");
    res.status(200).send({ message: "Order List", orders });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get User Orders (Customer view)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderModel
      .find({ user: userId })
      .populate("products.product")
      .populate("user", "name email");
    res.status(200).send({ message: "User Orders", orders });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update Order Status (Vendor/Admin updates)
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body; // expected: "delivered" / "cancelled" / "shipped"

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    await order.save();

    // If using Socket.IO, emit update event
    if (req.io) {
      req.io.emit("orderUpdated", order);
    }

    res.status(200).send({
      message: "Order updated successfully!",
      updatedOrder: order,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// "Delete" Order → Actually Cancel It
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Mark as cancelled instead of deleting
    order.orderStatus = "cancelled";
    await order.save();
    res.status(200).send({
      message: "Order cancelled successfully!",
      cancelledOrder: order,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getUserOrders,
  updateOrder,
  deleteOrder, // still exported, but it cancels instead
};
