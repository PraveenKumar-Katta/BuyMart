import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let dispatch = useDispatch();
  return (
    <div>
      <Navbar />
      <Main />
    </div>
  );
};

export default Home;
