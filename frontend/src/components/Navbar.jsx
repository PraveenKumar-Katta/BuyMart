import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchCart } from "../features/cartSlice";
import { setSearchTerm } from "../features/productSlice";
import {
  CircleUser,
  House,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user?.id]);

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setIsSidebarOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  const goTo = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    // Full reload so the cart and any other Redux state are cleared too
    window.location.href = "/login";
  };

  const desktopLink = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-zinc-100 text-zinc-900"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    }`;

  const iconButton =
    "relative flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-8">
          {/* Mobile menu button */}
          <button
            className={`${iconButton} md:hidden`}
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-xl font-extrabold tracking-tight text-zinc-900"
          >
            BuyMart
          </button>

          {/* Search */}
          {user?.role === "user" ? (
            <div className="relative ml-auto flex-1 md:ml-4 md:max-w-xl">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                placeholder="Search products, brands and more"
                aria-label="Search products"
                className="h-10 w-full rounded-xl border border-transparent bg-zinc-100 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-200"
                onChange={handleSearch}
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right side */}
          <nav className="flex items-center gap-1">
            {user?.role === "user" && (
              <NavLink
                to="/myorders"
                className={(state) => `hidden md:block ${desktopLink(state)}`}
              >
                My Orders
              </NavLink>
            )}

            {user && (
              <button
                onClick={() => navigate("/profile")}
                className={`${iconButton} hidden md:flex`}
                aria-label="Profile"
              >
                <CircleUser size={22} />
              </button>
            )}

            {user?.role === "user" && (
              <button
                onClick={() => navigate("/cart")}
                className={iconButton}
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-xs font-semibold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Logout (last item) */}
            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 hidden items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 md:flex"
              >
                <LogOut size={16} />
                Log out
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Log in
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        >
          <aside
            className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Menu"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900">
                BuyMart
              </span>
              <button
                className={iconButton}
                onClick={toggleSidebar}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={() => goTo("/")}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                <House size={20} />
                Home
              </button>

              {user?.role === "user" && (
                <button
                  onClick={() => goTo("/myorders")}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  <Package size={20} />
                  My Orders
                </button>
              )}

              {user && (
                <button
                  onClick={() => goTo("/profile")}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  <CircleUser size={20} />
                  Profile
                </button>
              )}
            </div>

            {/* Logout (last item) */}
            {user && (
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-3 text-left font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={20} />
                Log out
              </button>
            )}
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;