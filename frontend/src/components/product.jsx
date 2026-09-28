import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../utiles";

const LOW_STOCK_LIMIT = 5;

const Icon = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Skeleton = () => (
  <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 md:px-8">
    <div className="aspect-square animate-pulse rounded-3xl bg-zinc-200" />
    <div className="space-y-5 pt-2">
      <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="h-12 w-40 animate-pulse rounded bg-zinc-200" />
      <div className="h-24 w-full animate-pulse rounded bg-zinc-200" />
      <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-200" />
    </div>
  </div>
);

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.info("Log in to add items to your cart", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      setAdding(true);
      await axios.post(`${BaseUrl}/cart/add`, {
        userId: user.id,
        productId: product._id,
        quantity,
      });

      toast.success("Added to cart", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Couldn't add this item. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
      console.log(error.message);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100">
        <Skeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-100 px-4 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900">
          We couldn't find this product
        </h2>
        <p className="max-w-sm text-zinc-500">
          It may have been removed or the link may be wrong.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const outOfStock = !product.stock || product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_LIMIT;
  const maxQty = Math.max(product.stock || 1, 1);

  return (
    <div className="min-h-screen bg-zinc-100 pb-28 md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
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

        <div className="grid gap-8 md:grid-cols-2 md:gap-14">
          {/* Image */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-zinc-200">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
            {outOfStock && (
              <span className="absolute left-4 top-4 rounded-full bg-zinc-900 px-3 py-1 text-sm font-medium text-white">
                Sold out
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.category && (
              <p className="mb-2 text-sm font-medium text-zinc-500">
                {product.category}
              </p>
            )}

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <p className="text-4xl font-bold tracking-tight text-zinc-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
              {outOfStock ? (
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-red-200">
                  Out of stock
                </span>
              ) : lowStock ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                  In stock
                </span>
              )}
            </div>

            <p className="mt-6 max-w-prose leading-relaxed text-zinc-600">
              {product.description}
            </p>

            {/* Quantity + CTA */}
            <div className="mt-8 hidden items-center gap-4 md:flex">
              <div className="inline-flex items-center rounded-xl bg-white ring-1 ring-zinc-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || outOfStock}
                  aria-label="Decrease quantity"
                  className="h-12 w-12 text-xl text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 rounded-l-xl"
                >
                  −
                </button>
                <span
                  className="w-10 text-center font-semibold text-zinc-900"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty || outOfStock}
                  aria-label="Increase quantity"
                  className="h-12 w-12 text-xl text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 rounded-r-xl"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={addToCart}
                disabled={outOfStock || adding}
                className="h-12 flex-1 rounded-xl bg-zinc-900 px-6 text-base font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {outOfStock
                  ? "Out of stock"
                  : adding
                  ? "Adding…"
                  : "Add to cart"}
              </button>
            </div>

            {/* Assurances */}
            <ul className="mt-10 divide-y divide-zinc-200 rounded-2xl bg-white ring-1 ring-zinc-200">
              <li className="flex items-center gap-4 p-4 text-sm text-zinc-700">
                <Icon>
                  <path d="M3 7h11v9H3z" />
                  <path d="M14 10h4l3 3v3h-7" />
                  <circle cx="7" cy="18" r="1.5" />
                  <circle cx="17" cy="18" r="1.5" />
                </Icon>
                <span>
                  <span className="font-medium text-zinc-900">
                    Delivery to your door
                  </span>
                  <br />
                  Shipping cost and date are shown at checkout.
                </span>
              </li>
              <li className="flex items-center gap-4 p-4 text-sm text-zinc-700">
                <Icon>
                  <path d="M4 12a8 8 0 0 1 14-5.3L20 9" />
                  <path d="M20 4v5h-5" />
                  <path d="M20 12a8 8 0 0 1-14 5.3L4 15" />
                  <path d="M4 20v-5h5" />
                </Icon>
                <span>
                  <span className="font-medium text-zinc-900">
                    Easy returns
                  </span>
                  <br />
                  Return it if it isn't what you expected.
                </span>
              </li>
              <li className="flex items-center gap-4 p-4 text-sm text-zinc-700">
                <Icon>
                  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                  <path d="M9 12l2 2 4-4" />
                </Icon>
                <span>
                  <span className="font-medium text-zinc-900">
                    Secure payment
                  </span>
                  <br />
                  Your payment details are encrypted.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur md:hidden">
        <div className="inline-flex items-center rounded-xl ring-1 ring-zinc-300">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || outOfStock}
            aria-label="Decrease quantity"
            className="h-12 w-10 text-xl text-zinc-700 disabled:text-zinc-300"
          >
            −
          </button>
          <span className="w-7 text-center font-semibold text-zinc-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty || outOfStock}
            aria-label="Increase quantity"
            className="h-12 w-10 text-xl text-zinc-700 disabled:text-zinc-300"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={outOfStock || adding}
          className="h-12 flex-1 rounded-xl bg-zinc-900 text-base font-semibold text-white transition active:bg-zinc-700 disabled:bg-zinc-300"
        >
          {outOfStock ? "Out of stock" : adding ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default Product;