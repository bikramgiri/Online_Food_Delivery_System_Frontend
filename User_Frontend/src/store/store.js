import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import productReducer from './productSlice'
import authReducer from './authSlice'
import checkOutReducer from './CheckOutSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    auth: authReducer,
    checkout: checkOutReducer
  },
});

export default store;
