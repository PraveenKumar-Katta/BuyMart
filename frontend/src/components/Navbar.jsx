import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../features/cartSlice";
import { setSearchTerm } from "../features/productSlice";
import { CircleUser, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, []);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div>
      <header className="flex justify-between items-center px-4 py-2 shadow">
        <div className="flex items-center gap-6 w-3/4">
          <div
            className="text-indigo-600 font-bold text-xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            BuyMart
          </div>

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

        <div className="flex items-center gap-6 w-1/4 justify-end text-sm">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
          >
            <CircleUser />
          </button>
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
    </div>
  );
};

export default Navbar;
