import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signupUser } from "../features/authSlice";
import { toast } from "react-toastify";

const ROLES = [
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Admin" },
];

const inputClass =
  "h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-200";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    if (email === "" || password === "" || role === "" || name === "") {
      return;
    }
    try {
      const formData = {
        name,
        email,
        password,
        role,
      };
      await dispatch(signupUser(formData)).unwrap();
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      toast.success("Account created. Please log in.");
    } catch (error) {
      toast.error(error?.message || error || "Couldn't sign up. Try again.");
    }
  }

  const disabled = !name || !email || !password || loading;

  return (
    <div className="grid min-h-screen bg-zinc-100 lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <div className="hidden flex-col justify-between bg-zinc-900 p-12 text-white lg:flex">
        <span className="text-2xl font-extrabold tracking-tight">BuyMart</span>
        <div>
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Create your account.
          </h2>
          <p className="mt-4 max-w-sm text-zinc-400">
            Sign up to save items to your cart, place orders and track them in
            one place.
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
            Sign up
          </h1>
          <p className="mt-2 text-zinc-500">
            It takes a minute. Fill in your details below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>

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
                className={inputClass}
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
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-12`}
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

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-zinc-700">
                Account type
              </legend>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-200 p-1">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`cursor-pointer rounded-lg py-2.5 text-center text-sm font-medium transition focus-within:ring-2 focus-within:ring-zinc-900 ${
                      role === r.value
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={disabled}
              className="h-12 w-full rounded-xl bg-zinc-900 font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;