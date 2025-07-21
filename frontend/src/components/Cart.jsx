import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeCartItem } from "../features/cartSlice";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user?.id]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItem({ userId: user.id, productId, quantity })).unwrap();
      toast.success("Quantity updated!");
    } catch (err) {
      toast.error(err || "Failed to update item.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeCartItem({ userId: user.id, productId })).unwrap();
      toast.success("Item removed from cart!");
    } catch (err) {
      toast.error(err || "Failed to remove item.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-center" />
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>
      {cart.items.map((item) => (
        <div key={item.product._id} className="flex items-center justify-between border-b py-4">
          <div className="flex items-center gap-4">
            <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p>₹ {item.product.price}</p>
              <div className="flex items-center mt-2 gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button
            className="text-red-600 hover:underline"
            onClick={() => handleRemove(item.product._id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right font-bold text-xl mt-6">
        Total: ₹{" "}
        {cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)}
      </div>
    </div>
  );
};

export default Cart;
