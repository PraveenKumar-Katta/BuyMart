  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";
  import { BaseUrl } from "../utiles";

  export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (userId, { rejectWithValue }) => {
      try {
        const res = await axios.get(`${BaseUrl}/cart/${userId}`);
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch cart"
        );
      }
    }
  );

  export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
      try {
        const res = await axios.post(`${BaseUrl}/cart/add`, {
          userId,
          productId,
          quantity,
        });
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add to cart"
        );
      }
    }
  );

  export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
      try {
        const res = await axios.put(
          `${BaseUrl}/cart/${userId}/item/${productId}`,
          { quantity }
        );
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update item"
        );
      }
    }
  );
  export const clearCartItems=createAsyncThunk(
    "cart/clearCart",
    async(userId,{rejectWithValue})=>{
      try {
        let res=await axios.put(`${BaseUrl}/cart/${userId}`)
        console.log(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
  )

  export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async ({ userId, productId }, { rejectWithValue }) => {
      try {
        const res = await axios.delete(
          `${BaseUrl}/cart/${userId}/item/${productId}`
        );
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove item"
        );
      }
    }
  );

  const cartSlice = createSlice({
    name: "cart",
    initialState: {
      cart: null,
      loading: false,
      error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCart.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
        })
        .addCase(fetchCart.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
          state.cart = action.payload;
        })

        .addCase(updateCartItem.fulfilled, (state, action) => {
          state.cart = action.payload;
        })

        .addCase(removeCartItem.fulfilled, (state, action) => {
          state.cart = action.payload;
        })
        .addCase(clearCartItems.fulfilled,(state,action)=>{
          state.cart = action.payload;
        })
    },
  });

  export default cartSlice.reducer;
