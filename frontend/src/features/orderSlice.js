import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseUrl } from "../utiles";
import axios from "axios";

const token = localStorage.getItem("authToken");

// Place Order
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (order, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BaseUrl}/orders`, order, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);

// Fetch Orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data)
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Update Order Status (Vendor/Admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BaseUrl}/orders/${orderId}`,
        { orderStatus:status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res)
      return res.data.updatedOrder; // backend returns updated order
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
); 

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
