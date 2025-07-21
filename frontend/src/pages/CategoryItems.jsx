import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BaseUrl } from "../utiles";

const CategoryItems = () => {
  const id = useParams().id;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    async function fetchCategoryItems() {
      try {
        const res = await axios.get(`${BaseUrl}/categories/${id}`);
        console.log(res.data);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching category products:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryItems();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-lg">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center capitalize text-blue-700">
        Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition-transform hover:-translate-y-1 bg-white"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain mb-3 rounded"
              />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-sm text-gray-500">
                {product.description.substring(0, 60)}...
              </p>
              <p className="text-blue-600 font-bold mt-2">${product.price}</p>
              <Link to={`/dashboard/product/${product._id}`}>
                viewDetails
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItems;
