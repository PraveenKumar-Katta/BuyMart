import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
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

const CategoryItems = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryItems() {
      setLoading(true);
      try {
        const res = await axios.get(`${BaseUrl}/categories/${id}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching category products:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryItems();
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
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
          All products
        </Link>

        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Category products
          </h1>
          {!loading && (
            <p className="shrink-0 text-sm text-zinc-500">
              {products.length} {products.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-900">
              No products in this category yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Check back soon, or browse everything we have.
            </p>
            <Link
              to="/dashboard"
              className="mt-5 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => {
              const name = product.name || product.title;
              const soldOut =
                product.stock !== undefined && product.stock <= 0;
              return (
                <Link
                  to={`/dashboard/product/${product._id}`}
                  key={product._id}
                  className="group flex flex-col rounded-2xl bg-white p-3 ring-1 ring-zinc-200 transition hover:shadow-md hover:ring-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-50">
                    <img
                      src={product.image}
                      alt={name}
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
                    <h2 className="line-clamp-1 font-semibold text-zinc-900">
                      {name}
                    </h2>
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
      </div>
    </div>
  );
};

export default CategoryItems; 