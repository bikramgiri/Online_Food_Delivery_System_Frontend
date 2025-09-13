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
      const { orderId, orderStatus } = action.payload;
      const index = state.orders.findIndex((order) => order._id === orderId);
      if (index !== -1) {
        state.orders[index].orderStatus = orderStatus;
      }
    },
    updatePaymentStatusById: (state, action) => {
      const { orderId } = action.payload;
      const index = state.orders.findIndex((order) => order._id === orderId);
      if (index !== -1) {
        state.orders[index] = action.payload.data;
      }
    },
  },
});

export const {
  setStatus,
  setOrders,
  deleteOrderById,
  updateOrderStatusById,
  updatePaymentStatusById,
} = OrderSlice.actions;
export default OrderSlice.reducer;

export function fetchOrders() {
  return async function fetchOrdersThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/orders");
      dispatch(setOrders(response.data.data.reverse()));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function updateOrdersStatus(orderId, orderStatus) {
  return async function updateOrderStatusThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/admin/orders/${orderId}`,
        {
          orderStatus,
        }
      );
      console.log("Update response:", response);
      dispatch(
        updateOrderStatusById({
          orderId,
          orderStatus: response.data.data.orderStatus,
        })
      );
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchOrders()); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to update order status:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function updatePaymentStatus(orderId, paymentStatus) {
  return async function updatePaymentStatusThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/admin/order/paymentstatus/${orderId}`,
        {
          paymentStatus, // Send nested field
        }
      );
      console.log("Update response:", response);
      dispatch(
        updatePaymentStatusById({
          orderId,
          data: response.data.data
        })
      );
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchOrders()); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to update payment status:", error.response?.data);
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
      // make: If delete is triggred from single order page then redirect to orders page
      if (response.status === 200 && window.location.pathname === `/admin/orders/${orderId}`) {
        window.location.href = "/admin/orders";
      }
      dispatch(fetchOrders()); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}