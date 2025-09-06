import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http/index";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    status: STATUSES.SUCCESS,
    orders: []
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setStatus, setOrders } = OrderSlice.actions;
export default OrderSlice.reducer;

export function fetchOrders() {
  return async function fetchOrdersThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/orders");
      dispatch(setOrders(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

