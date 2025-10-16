import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BaseUrl } from "../utiles";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BaseUrl}/products/get-products`);
      return res.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${BaseUrl}/products/delete-product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.put(
        `${BaseUrl}/products/update-product/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await axios.post(`${BaseUrl}/products/add-product`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    message: "",
    searchTerm: "",
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.message = "Product Added";
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.message = "Product Deleted";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
          state.message = "Product Updated";
        }
      });
  },
});

export const { clearProducts,setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
