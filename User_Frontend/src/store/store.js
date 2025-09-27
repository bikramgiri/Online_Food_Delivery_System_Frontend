import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice'
import productReducer from './productSlice'
import authReducer from './authSlice'
import checkOutReducer from './CheckOutSlice'
import reviewReducer from './reviewSlice' // Import the review reducer

const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    auth: authReducer,
    checkout: checkOutReducer,
    review: reviewReducer, // Add the review reducer here
  },
});

export default store;
