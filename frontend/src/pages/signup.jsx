import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signupUser } from "../features/authSlice";

const Signup = () => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("user");
  let [message, setMessage] = useState("");
  let dispatch = useDispatch();
  let { loading, error } = useSelector((state) => state.auth);
  let [errorMsg,setError]=useState(error)
  async function handleSubmit(e) {
    e.preventDefault();
    if (email == "" || password == "" || role == "" || name == "") {
      return;
    }
    try {
      let formData = {
        name,
        email,
        password,
        role,
      };
      await dispatch(signupUser(formData)).unwrap();
      setMessage("Signup successful!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (error) {
      setMessage(error.message);
    } 
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
        </select>

        <button
          type="submit"
          disabled={!name || !email || !password}
          className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
            !name || !email || !password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p>
          Already Have an Account?<Link to={"/login"}>LogIn</Link>
        </p>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Signup;
