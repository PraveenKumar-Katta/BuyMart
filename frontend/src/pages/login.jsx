import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../features/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    if (email === "" || password === "") {
      return;
    }
    try {
      const credential = { email, password };
      await dispatch(loginUser(credential)).unwrap();
      setEmail("");
      setPassword("");
      navigate("/dashboard");
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error?.message || error || "Couldn't log in. Try again.");
    }
  }

  const disabled = !email || !password || loading;

  return (
    <div className="grid min-h-screen bg-zinc-100 lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <div className="hidden flex-col justify-between bg-zinc-900 p-12 text-white lg:flex">
        <span className="text-2xl font-extrabold tracking-tight">BuyMart</span>
        <div>
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Pick up where you left off.
          </h2>
          <p className="mt-4 max-w-sm text-zinc-400">
            Log in to see your cart, track your orders and check out faster.
          </p>
        </div>
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} BuyMart
        </p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <span className="mb-8 block text-2xl font-extrabold tracking-tight text-zinc-900 lg:hidden">
            BuyMart
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Log in
          </h1>
          <p className="mt-2 text-zinc-500">
            Enter your email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-4 pr-12 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={disabled}
              className="h-12 w-full rounded-xl bg-zinc-900 font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;