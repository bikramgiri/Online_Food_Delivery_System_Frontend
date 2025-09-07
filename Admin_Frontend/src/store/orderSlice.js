import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http/index";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    status: STATUSES.SUCCESS,
    orders: [],
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    // remove an order by its ID
    deleteOrderById: (state, action) => {
      const index = state.orders.findIndex(
        (order) => order._id === action.payload.orderId
      );
      if (index !== -1) {
        state.orders.splice(index, 1);
      }
    },
updateOrderStatusById: (state, action) => {
      // const { orderId, status } = action.payload;
      const index = state.orders.findIndex((order) => order._id === action.payload.orderId);
      if (index !== -1) {
        state.orders[index].status = action.payload.data;
      }
    },
  },
});

export const { setStatus, setOrders, deleteOrderById, updateOrderStatusById } = OrderSlice.actions;
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

export function deleteOrders(orderId) {
  return async function deleteOrderThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.delete(
        `/admin/orders/${orderId}`
      );
      dispatch(deleteOrderById({ orderId }));
      dispatch(setStatus(STATUSES.SUCCESS));
      if (response.status === 200) {
        window.location.href = "/admin/orders"; // Redirect to orders page
      }
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


export function updateOrdersStatus(orderId, status) {
  return async function updateOrderStatusThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/admin/orders/${orderId}`, {
        status,
      });
      console.log("Update response:", response);
      dispatch(updateOrderStatusById({ orderId, data: response.data.data }));
      dispatch(setStatus(STATUSES.SUCCESS));
      // if (response.status === 200) {
      //   window.location.href = `/orderdetails/${orderId}`; // Redirect after update
      // }
    } catch (error) {
      console.log("Failed to update order status:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}
