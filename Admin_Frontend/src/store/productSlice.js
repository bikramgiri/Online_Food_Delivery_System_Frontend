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
    deleteProductById: (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload.productId
      );
      if (index !== -1) {
        state.products.splice(index, 1);
          }
        },
  },
});

export const { setStatus, setProducts, deleteProductById } = ProductSlice.actions;
export default ProductSlice.reducer;

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/products");
      dispatch(setProducts(response.data.data.reverse()));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch products:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function deleteProduct(productId) {
  return async function deleteProductThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await APIAuthenticated.delete(
        `/admin/products/${productId}`
      );
      dispatch(deleteProductById({ productId }));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to delete product:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}
