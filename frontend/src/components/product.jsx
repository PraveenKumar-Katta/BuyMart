import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BaseUrl } from "../utiles";


const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addToCart = async () => {
    try {
      const res = await axios.post(`${BaseUrl}/cart/add`, {
        userId: user.id,
        productId: product._id,
        quantity: 1,
      });

      toast.success("Product added to cart!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

    } catch (error) {
      toast.error("Failed to add product to cart", {
        position: "top-right",
        autoClose: 2000,
      });
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer /> {/* Toast display area */}
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full flex  flex-col md:flex-row p-6 gap-6">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg border"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-700 text-lg mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-green-600 mb-2">₹{product.price}</p>
            <p className="text-md text-gray-600 mb-4">Stock: {product.stock}</p>
          </div>
          <button
            onClick={addToCart}
            className="mt-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg transition"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
