import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import orderSlice from './orderSlice'
import userSlice from './UserSlice'
import productSlice from './productSlice'
import reviewSlice from './reviewSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    order: orderSlice,
    user: userSlice,
    product: productSlice,
    review: reviewSlice,
  },
});

export default store;
