import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCartItems,
} from "../features/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import { placeOrder } from "../features/orderSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  let [popup, setPopup] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user?.id]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(
        updateCartItem({ userId: user.id, productId, quantity })
      ).unwrap();
      toast.success("Quantity updated!");
    } catch (err) {
      toast.error(err || "Failed to update item.");
    }
  };

  const handlePlaceOrder = () => {
    let order = {
      user: user.id,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: cart.items.reduce(
        (acc, item) => acc + (item.product?.price || 0) * item.quantity,
        0
      ),
    };

    dispatch(placeOrder(order))
      .unwrap()
      .then(() => {
        toast.success("✅ Order Placed Successfully");
        dispatch(clearCartItems(user.id));
        navigate("/myorders");
        setPopup(false);
      })
      .catch((err) => {
        toast.error(err || "Failed to place order");
      });
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeCartItem({ userId: user.id, productId })).unwrap();
      dispatch(clearCartItems());
      toast.success("Item removed from cart!");
    } catch (err) {
      toast.error(err || "Failed to remove item.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty cart"
          className="w-40 h-40 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Your cart is empty 🛒
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl shadow-md transition"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col justify-center">
      <ToastContainer position="top-center" />
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>
      {/* confirm popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="flex flex-col min-w-60 gap-6 text-center w-[30%] bg-gray-200 rounded-xl p-10 shadow-lg">
            <p className="text-2xl">Are You Confirm to Place Order</p>
            <div className="flex gap-10 justify-center">
              <button
                onClick={() => setPopup(false)}
                className="text-white font-semibold px-4 py-2 cursor-pointer rounded-xl bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePlaceOrder()}
                className="text-white font-semibold px-4 py-2 cursor-pointer rounded-xl bg-green-600"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {cart.items.map((item) => {
        const product = item.product || {};
        return (
          <div
            key={item._id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name || "Product"}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">
                  {product.name || "Unnamed Product"}
                </h3>
                <p>₹ {product.price || "0"}</p>
                <div className="flex items-center mt-2 gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() =>
                      handleQuantityChange(
                        product._id || item.product,
                        item.quantity - 1
                      )
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() =>
                      handleQuantityChange(
                        product._id || item.product,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              className="text-red-600 hover:underline"
              onClick={() => handleRemove(product._id || item.product)}
            >
              Remove
            </button>
          </div>
        );
      })}

      <div className="text-right font-bold text-xl mt-6">
        <h1>
          Total: ₹{" "}
          {cart.items.reduce(
            (acc, item) => acc + (item.product?.price || 0) * item.quantity,
            0
          )}
        </h1>
        <button
          onClick={() => setPopup(true)}
          className="border p-2 m-1 rounded-xl active:bg-orange-400 cursor-pointer bg-orange-600 text-white"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
