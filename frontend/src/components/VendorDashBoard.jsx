import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../features/productSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../utiles";
import VendorOrders from "./VendorOrders";
import { fetchOrders } from "../features/orderSlice";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

const VendorDashBoard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(null);
  let [vendorProducts, setVendorProducts] = useState([]);
  let [edit, setEdit] = useState(false);
  let dispatch = useDispatch();
  let user = JSON.parse(localStorage.getItem("userInfo"));
  let products = useSelector((state) => state.products.products);
  let { orders } = useSelector((state) => state.orders);

  const myOrderProducts = orders.flatMap((o) =>
    o.products
      .filter(
        (p) => p.product.vendorId == user.id && o.orderStatus !== "Cancelled"
      )
      .map((p) => ({
        ...p,
        customer: o.user,
        status: o.orderStatus,
        orderId: o._id,
      }))
  );

  const earnings = myOrderProducts.reduce(
    (sum, p) => sum + (p.product?.price || 0) * (p.quantity || 1),
    0
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

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    let productInfo = { ...product, vendorId: user.id };
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

  function handleEdit(product) {
    setProduct(product);
    setShowForm(true);
    setEdit(product._id);
  }

  const statCards = [
    {
      key: "products",
      label: "Total products",
      value: vendorProducts.length,
      icon: Package,
      accent: "text-blue-600",
    },
    {
      key: "orders",
      label: "Orders",
      value: myOrderProducts.length,
      icon: ShoppingBag,
      accent: "text-emerald-600",
    },
    {
      key: "earnings",
      label: "Earnings",
      value: `₹${earnings.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      accent: "text-amber-600",
      disabled: true,
    },
    {
      key: "lowstock",
      label: "Low stock",
      value: lowStock.length,
      icon: AlertTriangle,
      accent: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Vendor dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your products and track your orders.
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            onClick={() => {
              getcategories();
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                {edit ? "Update product" : "Add new product"}
              </h2>
              <form onSubmit={handleAddProduct} className="grid gap-3">
                <input
                  className="rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  required
                />
                <input
                  className="rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                />
                <input
                  className="rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                  required
                />
                <input
                  type="number"
                  className="rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                />
                {categories && (
                  <select
                    className="rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                )}
                <textarea
                  className="rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  rows={3}
                  required
                ></textarea>
                <button
                  type="submit"
                  className="mt-1 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  {edit ? "Update product" : "Add product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map(({ key, label, value, icon: Icon, accent, disabled }) => (
            <button
              key={key}
              onClick={() => !disabled && setActiveTab(key)}
              disabled={disabled}
              className={`rounded-xl border bg-white p-4 text-left transition-colors ${
                disabled ? "cursor-default" : "hover:border-slate-300"
              } ${
                activeTab === key
                  ? "border-slate-900 ring-1 ring-slate-900"
                  : "border-slate-200"
              }`}
            >
              <Icon className={`mb-2 h-5 w-5 ${accent}`} />
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-semibold text-slate-900">{value}</p>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-8">
          {activeTab === "lowstock" && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-rose-600">
                <AlertTriangle className="h-5 w-5" />
                Low stock
              </h2>
              {lowStock.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nothing running low right now.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {lowStock.map((p) => (
                    <div
                      key={p._id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <h3 className="font-medium text-slate-900">{p.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Price: ₹{p.price}
                      </p>
                      <p className="text-sm text-slate-500">
                        Stock left:{" "}
                        <span className="font-semibold text-rose-600">
                          {p.stock}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <VendorOrders myOrderProducts={myOrderProducts} />
          )}

          {activeTab === "products" && (
            <div>
              {Array.isArray(vendorProducts) && vendorProducts.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <ul className="divide-y divide-slate-100">
                    {vendorProducts.map((p) => (
                      <li
                        key={p._id}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-11 w-11 rounded-md object-cover ring-1 ring-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-11 w-11 shrink-0 rounded-md bg-slate-100" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">
                              {p.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              Stock: {p.stock} · ₹{p.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              dispatch(deleteProduct(p._id));
                              toast.success("Product deleted!", {
                                position: "top-right",
                                autoClose: 2000,
                                theme: "colored",
                              });
                            }}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
                  <Package className="mb-3 h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-500">
                    No products yet — add your first one to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashBoard;