import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../features/cartSlice";
import { setSearchTerm } from "../features/productSlice";
import { CircleUser, ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, []);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 py-2 shadow">
        <div className="flex items-center gap-4 w-3/4">
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu size={28} />
          </button>

          {/* Logo */}
          <div
            className="text-indigo-600 font-bold text-xl cursor-pointer hidden md:block"
            onClick={() => navigate("/")}
          >
            BuyMart
          </div>

          {/* Search (always visible) */}
          {user?.role === "user" && (
            <div className="flex-1">
              <input
                type="search"
                placeholder="Search for Products, Brands and More"
                className="w-full px-4 py-2 rounded bg-blue-50 outline-none border border-gray-200"
                onChange={handleSearch}
              />
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 w-1/4 justify-end text-sm">
          {/* Cart (always visible) */}
          {user?.role === "user" && (
            <div
              onClick={() => navigate("/cart")}
              className="relative hover:text-blue-600 cursor-pointer"
            >
              <ShoppingCart />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleSidebar}
        >
          <div
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-5 flex flex-col gap-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="self-end mb-4" onClick={toggleSidebar}>
              <X size={28} />
            </button>

            {/* Sidebar Links */}
            <button
              onClick={() => {
                navigate("/");
                toggleSidebar();
              }}
              className="py-2 px-3 rounded hover:bg-gray-100 text-left"
            >
              Home
            </button>

            {user?.role === "user" && (
              <button
                onClick={() => {
                  navigate("/myorders");
                  toggleSidebar();
                }}
                className="py-2 px-3 rounded hover:bg-gray-100 text-left"
              >
                My Orders
              </button>
            )}

            <button
              onClick={() => {
                navigate("/profile");
                toggleSidebar();
              }}
              className="py-2 px-3 rounded hover:bg-gray-100 text-left"
            >
              Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
