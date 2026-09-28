import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCartItems,
} from "../features/cartSlice";
import { toast } from "react-toastify";
import { placeOrder } from "../features/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

const formatPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const CartSkeleton = () => (
  <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_360px]">
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-2xl bg-zinc-200" />
      ))}
    </div>
    <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
  </div>
);

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [popup, setPopup] = useState(false);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user?.id]);

  // Close the confirm dialog with Escape
  useEffect(() => {
    if (!popup) return;
    const onKeyDown = (e) => e.key === "Escape" && setPopup(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [popup]);

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

    setPlacing(true);
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
      })
      .finally(() => setPlacing(false));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100">
        <CartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-zinc-100 px-4 text-center">
        <h2 className="text-xl font-semibold text-zinc-900">
          We couldn't load your cart
        </h2>
        <p className="mt-1 text-sm text-red-600">{String(error)}</p>
        <button
          onClick={() => user?.id && dispatch(fetchCart(user.id))}
          className="mt-5 rounded-xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-zinc-100 px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
          <ShoppingCart size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Your cart is empty
        </h2>
        <p className="mt-2 max-w-sm text-zinc-500">
          Products you add will show up here so you can review and order them.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to products
        </Link>
        <div className="mb-6 flex items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Your cart
          </h1>
          <p className="text-sm text-zinc-500">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <ul className="space-y-4">
            {cart.items.map((item) => {
              const product = item.product || {};
              const productId = product._id || item.product;
              return (
                <li
                  key={item._id}
                  className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-zinc-200 sm:gap-6"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-50 sm:h-32 sm:w-32">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name || "Product"}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 font-semibold text-zinc-900">
                          {product.name || "Unnamed product"}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(productId)}
                        aria-label={`Remove ${product.name || "item"}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="inline-flex items-center rounded-xl ring-1 ring-zinc-300">
                        <button
                          onClick={() =>
                            handleQuantityChange(productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-l-xl text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent"
                        >
                          <Minus size={16} />
                        </button>
                        <span
                          className="w-9 text-center text-sm font-semibold text-zinc-900"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-r-xl text-zinc-700 transition hover:bg-zinc-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-zinc-900">
                        {formatPrice((product.price || 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Summary */}
          <aside className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-zinc-900">
              Order summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-600">
                <dt>
                  Items ({totalItems})
                </dt>
                <dd>{formatPrice(totalAmount)}</dd>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-4 text-base font-bold text-zinc-900">
                <dt>Total</dt>
                <dd className="text-xl">{formatPrice(totalAmount)}</dd>
              </div>
            </dl>
            <button
              onClick={() => setPopup(true)}
              className="mt-6 h-12 w-full rounded-xl bg-zinc-900 font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400"
            >
              Place order
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-3 h-12 w-full rounded-xl font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Continue shopping
            </button>
          </aside>
        </div>
      </div>

      {/* Confirm dialog */}
      {popup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm"
          onClick={() => !placing && setPopup(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3
              id="confirm-title"
              className="text-xl font-bold tracking-tight text-zinc-900"
            >
              Place this order?
            </h3>
            <p className="mt-2 text-zinc-600">
              You're ordering {totalItems} {totalItems === 1 ? "item" : "items"}{" "}
              for <span className="font-semibold text-zinc-900">{formatPrice(totalAmount)}</span>.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPopup(false)}
                disabled={placing}
                className="h-11 flex-1 rounded-xl border border-zinc-300 font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="h-11 flex-1 rounded-xl bg-zinc-900 font-semibold text-white transition hover:bg-zinc-700 disabled:bg-zinc-400"
              >
                {placing ? "Placing…" : "Place order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;