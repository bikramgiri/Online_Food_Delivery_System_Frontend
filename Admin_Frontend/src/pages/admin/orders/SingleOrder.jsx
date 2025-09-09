import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteOrders, fetchOrders, updateOrdersStatus, updatePaymentStatus } from "../../../store/orderSlice";
import { STATUSES } from "../../../global/statuses";

const SingleOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { orders, status } = useSelector((state) => state.order);
  const [message, setMessage] = useState("");
  const [activeForm, setActiveForm] = useState(null); // Track which form is open: "orderStatus" or "paymentStatus"
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    dispatch(fetchOrders()); // Ensure orders are fetched if not already in store
  }, [dispatch]);

  // Filter orders to find the one with matching ID
  const filteredOrder = orders.find((order) => order._id === id);
  console.log("Filtered Order:", filteredOrder); // Debug to check the object

// Set initial statuses when filteredOrder is available
  useEffect(() => {
    if (filteredOrder) {
      setOrderStatus(filteredOrder.orderStatus || "");
      setPaymentStatus(filteredOrder.paymentDetails?.status || "");
    }
  }, [filteredOrder]);

  const ShippingPrice = 200;
  const totalProductAmount = filteredOrder?.totalAmount
    ? filteredOrder.totalAmount + ShippingPrice
    : 0;

// const handleOrderStatus = async () => {
//       dispatch(updateOrdersStatus(id, orderStatus));
//   };

const handleOrderStatus =  () => {
    try {
      dispatch(updateOrdersStatus(id, orderStatus ));
      setMessage("Order status updated successfully");
      setTimeout(() => {
        setMessage("");
        setActiveForm(null); // Hide form after success
      }, 2000);
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage("Failed to update order status");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handlePaymentStatus =  () => {
    try {
      dispatch(updatePaymentStatus(id, paymentStatus ));
      setMessage("Payment status updated successfully");
      setTimeout(() => {
        setMessage("");
        setActiveForm(null); // Hide form after success
      }, 2000);
    } catch (error) {
      console.error("Error updating payment status:", error);
      setMessage("Failed to update payment status");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const deleteOrder = () => {
    dispatch(deleteOrders(id));
    if (status === STATUSES.SUCCESS) {
      setMessage("Order deleted successfully");
      setTimeout(() => {
        setMessage("");
        navigate("/admin/orders");
      }, 2000);
    }
  };

  return (
    <div className=" min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <button
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Orders Page
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Order ID Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">Order ID: {id}</h1>
        </div>

        {/* Products Details */}
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Products
          </h2>
          <div className="space-y-4">
            {filteredOrder &&
              filteredOrder.items &&
              filteredOrder.items.length > 0 &&
              filteredOrder.items.map((item) => (
                <div
                  key={item.product?._id}
                  className="rounded-lg mb-2 border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-4"
                >
                  <div className="space-y-2 md:flex md:items-center md:justify-between md:gap-4 md:space-y-0">
                    <img
                      className="h-25 w-35 dark:block"
                      src={item.product?.productImage}
                      alt={item.product?.productName || "Product image"}
                    />
                    <div className="flex mt-10 items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center">
                        <p className="font-medium dark:text-white">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          NPR {item.product?.productPrice}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 ml-4 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <p className="text-2xl font-medium text-gray-900 dark:text-white">
                        {item.product?.productName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Order summary
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="font-medium dark:text-white">Order Status</dt>
                <dd className="font-medium dark:text-white">
                  {filteredOrder?.orderStatus}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-white">
                  Payment Method
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  {filteredOrder?.paymentDetails?.method}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white">Payment Status</dt>
                <dd className="font-medium text-green-600">
                  {filteredOrder?.paymentDetails?.status}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white">Total Products</dt>
                <dd className="font-medium text-green-600">
                  {filteredOrder?.items?.length}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white">Shipping Price</dt>
                <dd className="font-medium text-green-600">
                  NPR {ShippingPrice.toFixed(2)}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="font-medium dark:text-white">
                  Total Products Price
                </dt>
                <dd className="font-medium text-green-600">
                  NPR {filteredOrder?.totalAmount.toFixed(2)}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-xl font-bold text-gray-900 dark:text-white">
                  Total Amount
                </dt>
                <dd className="text-xl font-bold text-gray-900 dark:text-white">
                  NPR {totalProductAmount.toFixed(2)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
         <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Customer Details
          </p>
          <div>
           <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt className="text-base font-normal text-gray-500 dark:text-white">
               Name
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                {filteredOrder?.user?.username}
              </dd>
            </dl>
            <dl className="mt-4 flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-white">
                Shipping Address
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                {filteredOrder?.shippingAddress}
              </dd>
            </dl>
          </div>

          <div>
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-white">
                Phone Number
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                {filteredOrder?.user?.phoneNumber}
              </dd>
            </dl>
          </div>

          {/* Delivery Note */}
          <div>
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-white">
                Delivery Note
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                Delivery within 24 hours
              </dd>
            </dl>
          </div>
        </div>

        {/* Actions */}
        {/* <div className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
          <div className="p-6 flex space-x-4 justify-center bg-gray-50 dark:bg-gray-700">
            {filteredOrder?.orderStatus !== "cancelled" && (
              <>
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200"
                >
                  Update Order Status
                </button>
                <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200">
                  Edit Order
                </button>
              </>
            )}
            <button
              onClick={() => deleteOrder()} // Removed orderId._id, using id directly
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200"
            >
              Delete Order
            </button>
          </div>
          {message && (
            <p className="text-green-500 text-center mb-4">{message}</p>
          )}
        </div> */}

        {/* // Make that: when i click update order status button it open update order status form like wise in update payment status button by passing button Id */}

        {/* Actions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            {filteredOrder?.orderStatus !== "cancelled" && (
              <>
                <button
                  id="updateOrderStatus"
                  onClick={() => setActiveForm("orderStatus")}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200 w-full md:w-auto"
                >
                  Update Order Status
                </button>
                <button
                  id="updatePaymentStatus"
                  onClick={() => setActiveForm("paymentStatus")}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200 w-full md:w-auto"
                >
                  Update Payment Status
                </button>
              </>
            )}
            <button
              onClick={() => deleteOrder()}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200 w-full md:w-auto"
            >
              Delete Order
            </button>
          </div>
          {message && (
            <p className="text-green-500 text-center mt-4">{message}</p>
          )}
        </div>
       

        {/* Update Order Status Modal */}
        {activeForm === "orderStatus" && filteredOrder?.orderStatus !== "cancelled" && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-500 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Update Order Status
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOrderStatus();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Select Status
                  </label>
                  <select
                    id="status"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {/* <option value={filteredOrder?.orderStatus}>{filteredOrder?.orderStatus}</option> */}
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="In Transit">In Transit</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!orderStatus || orderStatus === filteredOrder?.orderStatus}
                    className="px-4 py-2 bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Payment Status Modal */}
        {activeForm === "paymentStatus" && filteredOrder?.paymentDetails.status !== "cancelled" && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-500 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Update Payment Status
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePaymentStatus();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Select Status
                  </label>
                  <select
                    id="status"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {/* <option value={filteredOrder?.paymentDetails.status}>{filteredOrder?.paymentDetails.status}</option> */}
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!paymentStatus || paymentStatus === filteredOrder?.paymentDetails.status}
                    className="px-4 py-2 bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleOrder;
