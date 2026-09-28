import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/productSlice";
import { BaseUrl } from "../utiles";

const ProductSkeleton = () => (
  <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
    <div className="aspect-square animate-pulse rounded-xl bg-zinc-200" />
    <div className="mt-4 space-y-2 px-1 pb-1">
      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
      <div className="h-5 w-20 animate-pulse rounded bg-zinc-200" />
    </div>
  </div>
);

const UserDashBoard = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const { products, loading, searchTerm } = useSelector(
    (state) => state.products
  );

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/categories`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* Categories */}
        {categories.length > 0 && (
          <section aria-label="Shop by category" className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Shop by category
            </h2>
            <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
              <div className="flex w-max gap-4 pb-1">
                {categories.map((cat) => (
                  <Link
                    to={`/category/${cat._id}`}
                    key={cat._id}
                    className="group flex w-28 shrink-0 flex-col items-center gap-3 focus:outline-none"
                  >
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white p-4 ring-1 ring-zinc-200 transition group-hover:ring-2 group-hover:ring-zinc-900 group-focus-visible:ring-2 group-focus-visible:ring-zinc-900">
                      <img
                        className="h-full w-full object-contain"
                        src={cat.img}
                        alt=""
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-zinc-700 transition group-hover:text-zinc-900">
                      {cat.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        <section aria-label="All products">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              {searchTerm ? `Results for "${searchTerm}"` : "All products"}
            </h2>
            {!loading && (
              <p className="shrink-0 text-sm text-zinc-500">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900">
                No products found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                {searchTerm
                  ? "Try a different word or check the spelling."
                  : "Check back soon for new products."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const soldOut = !product.stock || product.stock <= 0;
                return (
                  <Link
                    to={`product/${product._id}`}
                    key={product._id}
                    className="group flex flex-col rounded-2xl bg-white p-3 ring-1 ring-zinc-200 transition hover:shadow-md hover:ring-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105 ${
                          soldOut ? "opacity-50" : ""
                        }`}
                      />
                      {soldOut && (
                        <span className="absolute left-2 top-2 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
                          Sold out
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                      <h3 className="line-clamp-1 font-semibold text-zinc-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                        {product.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-bold text-zinc-900">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm font-medium text-zinc-500 transition group-hover:text-zinc-900">
                          View details
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashBoard;