import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http/index";

const ProductSlice = createSlice({
  name: "product",
  initialState: {
    status: STATUSES.SUCCESS,
    products: []
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setStatus, setProducts } = ProductSlice.actions;
export default ProductSlice.reducer;

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/products");
      dispatch(setProducts(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch products:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

