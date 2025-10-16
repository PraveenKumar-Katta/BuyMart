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
import VendorOrders from "./VendorOrders";
import { fetchOrders } from "../features/orderSlice";


const VendorDashBoard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(null);
  let [vendorProducts, setVendorProducts] = useState([]);
  let [edit, setEdit] = useState(false);
  let dispatch = useDispatch();
  let user = JSON.parse(localStorage.getItem("userInfo"));
  let products = useSelector((state) => state.products.products);
  let {orders} = useSelector((state) => state.orders);
  
  const myOrderProducts = orders.flatMap((o) =>
    o.products
      .filter((p) => p.product.vendorId == user.id&&o.orderStatus!=="Cancelled")
      .map((p) => ({
        ...p,
        customer: o.user,
        status:o.orderStatus,
        orderId:o._id
      }))
  );
  
  
  let lowStock = products.filter((p) => p.stock < 100);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

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
          <div
            onClick={() => setActiveTab("products")}
            className="bg-white rounded-2xl shadow cursor-pointer p-4 text-center"
          >
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl text-blue-600 font-bold">
              {vendorProducts.length}
            </p>
          </div>
          <div
            onClick={() => setActiveTab("orders")}
            className="bg-white cursor-pointer rounded-2xl shadow p-4 text-center"
          >
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-2xl text-green-600 font-bold">
              {myOrderProducts.length}
            </p>
          </div>
          <div className="bg-white cursor-pointer rounded-2xl shadow p-4 text-center">
            <h2 className="text-xl font-semibold">Earnings</h2>
            <p className="text-2xl text-yellow-500 font-bold">₹12,300</p>
          </div>
          <div
            onClick={() => setActiveTab("lowstock")}
            className="bg-white cursor-pointer rounded-2xl shadow p-4 text-center"
          >
            <h2 className="text-xl font-semibold">Low Stock</h2>
            <p className="text-2xl text-red-500 font-bold">{lowStock.length}</p>
          </div>
        </div>
      </div>
      {activeTab === "lowstock" && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-600">⚠️ Low Stock</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lowStock.map((p) => (
              <div
                key={p._id}
                className="border border-gray-300 rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-600">Price: ₹{p.price}</p>
                <p className="text-sm text-gray-600">
                  Stock Left:
                  <span className="font-bold text-red-500"> {p.stock}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab == "orders" && (
        <VendorOrders myOrderProducts={myOrderProducts} />
      )}
      {activeTab == "products" && (
        <div className="p-6">
          {Array.isArray(vendorProducts) && vendorProducts.length > 0 ? (
            <div className="space-y-4">
              {vendorProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center p-4 bg-white shadow-md rounded-xl hover:shadow-lg transition"
                >
                  {/* Product Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {p.name}
                    </h2>
                    <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                    <p className="text-sm text-gray-500">Price: ₹{p.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
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
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-500 italic text-center">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashBoard;
