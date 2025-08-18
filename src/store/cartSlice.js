import { createSlice } from "@reduxjs/toolkit";
const API_URL = import.meta.env.API_URL || 'http://localhost:3000';

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      state.push(action.payload);
    },
    removeItem: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
    addToFavorites: (state, action) => {
      const item = state.find((item) => item._id === action.payload);
      if (item) {
        item.isFavorite = true;
      }
    },
  },
});

export const { addItem, removeItem, addToFavorites } = cartSlice.actions
export default cartSlice.reducer
