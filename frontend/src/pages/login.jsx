import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/authSlice";
let BaseUrl = "http://localhost:5000";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  let [err,setErr]=useState("")
  let navigate=useNavigate()
  let dispatch=useDispatch()
  let {loading,error}=useSelector((state)=>state.auth)
  async function handleSubmit(e) {
    e.preventDefault();
    if (email == "" || password == "") {
      return;
    }
    try {
      let crediential={email,password}
      await dispatch(loginUser(crediential)).unwrap();
      setMessage("Login Sucess")
      setEmail("")
      setPassword("")
      navigate("/dashboard")
    } catch (error) {
      setMessage(error.message);
    }
  }
  useEffect(()=>{
    setErr(error)
    setTimeout(() => {
      setErr("")
    }, 2000);
  },[error])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Log In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!email || !password}
          className={`w-full py-2 rounded-md text-white ${
            !email || !password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading?"LogIng In...":"Log In"}
        </button>
        <p>Don't Have an Account?<Link to={"/signup"}>Sign Up</Link></p>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {error&& <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
