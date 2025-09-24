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
    // remove an order by its ID
    deleteOrderById: (state, action) => {
      const index = state.orders.findIndex(
        (order) => order._id === action.payload.orderId
      );
      if (index !== -1) {
        state.orders.splice(index, 1);
      }
    },
  // websocket reducers can be added here
    updateOrderStatus: (state, action) => {
      // const states = action.payload.status;
      // const orderId = action.payload.orderId;
      // or
      const { orderId, status } = action.payload;
      const updatedOrder = state.orders.map((order) => order._id === orderId ? { ...order, orderStatus: status } : order);
      state.orders = updatedOrder;
    },
  },
});

export const { setOrder, setStatus, setOrders, updateOrderStatus, deleteOrderById } = CheckOutSlice.actions;
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

export function updateOrderStatusInStore(data) {
  return function updateOrderStatusInStoreThunk(dispatch) {
    dispatch(updateOrderStatus(data));
  };
}

export function editOrders(orderId, data){
  return async function editOrdersThunk(dispatch){
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/users/orders/${orderId}`,
        data
      );
      dispatch(setOrder(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchOrder()); // Refetch to ensure state is updated
       return response;
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  }
}

export function deleteOrders(orderId) {
  return async function deleteOrderThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await APIAuthenticated.delete(
        `/users/orders/${orderId}`
      );
      dispatch(deleteOrderById({ orderId }));
      dispatch(setStatus(STATUSES.SUCCESS));
      // // make: If delete is triggred from single order page then redirect to orders page
      // if (response.status === 200 && window.location.pathname === `/admin/orders/${orderId}`) {
      //   window.location.href = "/admin/orders";
      // }
      dispatch(fetchOrder()); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to fetch order:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}