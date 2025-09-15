import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http";

const CheckOutSlice = createSlice({
  name: "checkout",
  initialState: {
    data: [],
    status: STATUSES.SUCCESS,
    orders: []
  },
  reducers: {
    setOrder: (state, action) => {
      state.data.push(action.payload); // For array of orders
    },
    setStatus: (state, action) => {
      state.status = action.payload; // for status
    },
    setOrders: (state, action) => {
      state.orders = action.payload; // for orders
    },
  },
});

export const { setOrder, setStatus, setOrders } = CheckOutSlice.actions;
export default CheckOutSlice.reducer;

export function createOrder(data) {
  return async function createOrderThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.post("/users/orders", data);
      dispatch(setOrder(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchOrder());
    } catch (error) {
      console.log("Failed to create order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchOrder() {
  return async function fetchOrderThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/users/orders");
      dispatch(setOrders(response.data.data.reverse()));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

