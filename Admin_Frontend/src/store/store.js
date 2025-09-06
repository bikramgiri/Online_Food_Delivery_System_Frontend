import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import orderSlice from './orderSlice'
import userSlice from './UserSlice'
import productSlice from './productSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    order: orderSlice,
    user: userSlice,
    product: productSlice,
  },
});

export default store;
