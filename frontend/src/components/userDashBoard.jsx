import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../utiles";

const UserDashBoard = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, searchTerm } = useSelector((state) => state.products);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/categories`);
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        {categories.map((cat) => (
          <div
            onClick={() => navigate(`/category/${cat._id}`)}
            className="shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer rounded hover:shadow-xl transition"
            key={cat._id}
          >
            <img className="w-20 h-20 object-contain" src={cat.img} alt={cat.title} />
            <p className="mt-2 font-medium">{cat.title}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                onClick={() => navigate(`product/${product._id}`)}
                key={product._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className=" object-cover rounded-md mb-3 "
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between gap-5 items-center mt-3">
                  <span className="text-blue-600 font-semibold">₹{product.price}</span>
                  <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashBoard;
