import { createSlice } from "@reduxjs/toolkit";
import { APIAuthenticated } from "../http";
import { STATUSES } from "../global/statuses";
const API_URL = import.meta.env.API_URL || "http://localhost:3000";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: STATUSES.SUCCESS,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    deleteItem: (state, action) => {
      const index = state.items.findIndex((item) => item.product._id === action.payload.productId);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    addToFavorites: (state, action) => {
      const item = state.items.find((item) => item.product._id === action.payload.productId);
      if (item) {
        item.isFavorite = true;
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    updateItems: (state, action) => {
      const index = state.items.findIndex(item => item.product._id === action.payload.productId);
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity;
      }
    },
    emptyCart: (state) => {
      state.items = [];
    },
  },
});

export const { setItems, deleteItem, addToFavorites, setStatus, updateItems, emptyCart } =
  cartSlice.actions;
export default cartSlice.reducer;

export function addToCart(productId) {
  return async function addToCartThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.post(`users/cart/${productId}`);
      dispatch(setItems(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to add item to cart:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchCartItems() {
  return async function fetchCartItemsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get(`users/cart`);
      dispatch(setItems(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch cart items:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function updateCartItem({ productId, quantity }) {
  return async function updateCartItemThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await APIAuthenticated.patch(`users/cart/${productId}`, { quantity });
      dispatch(updateItems({ productId, quantity }));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to update cart item:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function deleteCartItem(productId) {
  return async function deleteCartItemThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await APIAuthenticated.delete(`users/cart/${productId}`);
      dispatch(deleteItem(productId));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to update cart item:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}
