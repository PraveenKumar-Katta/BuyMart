import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../features/productSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../utiles";

const VendorDashBoard = () => {
  const [showForm, setShowForm] = useState(null);
  let [vendorProducts, setVendorProducts] = useState([]);
  let [edit, setEdit] = useState(false);
  let dispatch = useDispatch();
  let user = JSON.parse(localStorage.getItem("userInfo"));
  let products = useSelector((state) => state.products.products);

  useEffect(() => {
    if (Array.isArray(products) && user?.id) {
      const filtered = products.filter((p) => p.vendorId === user.id);
      setVendorProducts(filtered);
    }
  }, [products, user?.id]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: 0,
  });
  let [categories, setCategories] = useState(null);

  let getcategories = async () => {
    try {
      let res = await axios.get(`${BaseUrl}/categories`);
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error.message);
    }
  };

  //fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    let productInfo = { ...product, vendorId: user.id };
    console.log(productInfo);
    if (edit) {
      dispatch(updateProduct({ productId: edit, updatedData: productInfo }));
      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      setEdit(null);
    } else {
      dispatch(addProduct(productInfo));
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
    setShowForm(false);
    setProduct({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      stock: 0,
    });
  };

  //handleEdit
  function handleEdit(product) {
    setProduct(product);
    setShowForm(true);
    setEdit(product._id);
  }

  return (
    <div className="p-4 relative">
      <ToastContainer /> 
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => {
            getcategories();
            setShowForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid gap-4">
              <input
                className="border p-2 rounded"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
              />
              <input
                className="border p-2 rounded"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                required
              />
              <input
                className="border p-2 rounded"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="Image URL"
                required
              />
              <input
                type="Number"
                className="border p-2 rounded"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Stock"
              />
              {categories && (
                <select
                  className="border p-2 rounded"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              )}

              <textarea
                className="border p-2 rounded"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Product Description"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                {edit ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className={`transition duration-300 ${showForm ? "blur-sm" : ""}`}>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl text-blue-600 font-bold">
              {vendorProducts.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-2xl text-green-600 font-bold">15</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Earnings</h2>
            <p className="text-2xl text-yellow-500 font-bold">₹12,300</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Low Stock</h2>
            <p className="text-2xl text-red-500 font-bold">4</p>
          </div>
        </div>
      </div>
      <div>
        {Array.isArray(vendorProducts) && vendorProducts.length > 0 ? (
          <div className="mt-6">
            {vendorProducts.map((p) => (
              <div
                key={p._id}
                className="border flex justify-between items-center p-2 m-1 rounded"
              >
                <p>{p.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="border p-1">
                    Edit
                  </button>
                  <button
                    className="border p-1 text-red-500"
                    onClick={() => {
                      dispatch(deleteProduct(p._id));
                      toast.success("Product Deleted!", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default VendorDashBoard;
