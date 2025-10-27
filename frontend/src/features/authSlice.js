// /store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BaseUrl } from "../utiles";

// Base Axios config
const API = axios.create({
  baseURL:`${BaseUrl}/auth`,
});
let user=JSON.parse(localStorage.getItem("userInfo"))

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/signup", formData);
      console.log(res.data)
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await API.post("/login", credentials);
      console.log(res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const updateUser= createAsyncThunk(
  "auth/updateUser",
  async(formData,{rejectWithValue})=>{
    console.log(user)
    try {
      const res = await API.put(`update/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      console.log(res.data)
      return res.data; 
      
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = "Signup successful!";
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled,(state,action)=>{
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      })
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
