import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteOrders, fetchOrders } from "../../../store/orderSlice";
import { STATUSES } from "../../../global/statuses";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, status } = useSelector((state) => state.order);
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState("all-orders");
  const [selectedTime, setSelectedTime] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Function to format date: Thusrsday Aug 25, 2025
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter orders based on selected item
  const filteredOrders =
    selectedItem === "all-orders"
      ? currentOrders
      : currentOrders.filter((order) => order.orderStatus === selectedItem);

  // Filter orders based on selected time
  const timeFilteredOrders = filteredOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    switch (selectedTime) {
      case "today":
        return orderDate >= new Date(now.setHours(0, 0, 0, 0));
      case "this-week":
        return orderDate >= new Date(now.setDate(now.getDate() - now.getDay()));
      case "this-month":
        return orderDate >= new Date(now.getFullYear(), now.getMonth(), 1);
      case "last-3-months":
        return orderDate >= new Date(now.setMonth(now.getMonth() - 3));
      case "last-6-months":
        return orderDate >= new Date(now.setMonth(now.getMonth() - 6));
      case "this-year":
        return orderDate >= new Date(now.getFullYear(), 0, 1);
      default:
        return true;
    }
  });

  // Search functionality
  const searchedOrders = timeFilteredOrders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentDetails.method
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.paymentDetails.status
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(order.createdAt)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Date filter functionality but show all if date is not selected
  const dateFilteredOrders = searchedOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const selectedDate = new Date(date);
    return date
      ? orderDate.toDateString() === selectedDate.toDateString()
      : true;
  });

    const deleteOrder = (id) => {
      dispatch(deleteOrders(id));
      if (status === STATUSES.SUCCESS) {
        setMessage("Order deleted successfully");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    };

  return (
    <section className="bg-gray-900 min-h-screen py-12 antialiased text-gray-300">
    {message && (
      <p className="text-green-500 text-center mb-8">{message}</p>
    )}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">
              All Orders
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  onChange={(e) => setSelectedItem(e.target.value)}
                  id="order-type"
                  className="w-full sm:w-40 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all-orders">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="pre-order">Pre-order</option>
                  <option value="transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <span className="hidden font-medium sm:inline text-gray-400 mt-2">
                from
              </span>
              <div className="relative mr-8">
                <select
                  onChange={(e) => setSelectedTime(e.target.value)}
                  id="duration"
                  className="w-full sm:w-40 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
              <div className="relative">
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-700 dark:text-gray-200"
                  placeholder="Search..."
                />
              </div>
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  className="p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-700 dark:text-gray-200"
                  placeholder="Search..."
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-gray-200 uppercase text-xs font-semibold">
                  <th className="py-4 px-4 text-center">Order ID</th>
                  <th className="py-4 px-4 text-center">User Name</th>
                  <th className="py-4 px-4 text-center">Total Amount</th>
                  <th className="py-4 px-4 text-center">Order Status</th>
                  <th className="py-4 px-4 text-center">Payment Method</th>
                  <th className="py-4 px-4 text-center">Date</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dateFilteredOrders.length > 0 ? (
                  dateFilteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {order._id}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {order.user.username}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        NPR {order.totalAmount}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {order.orderStatus === "Pending" ? (
                          <div>
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              <svg
                                className="me-1 h-3 w-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 11.917 9.724 16.5 19 7.5"
                                />
                              </svg>
                              {order.orderStatus}
                            </dd>
                          </div>
                        ) : order.orderStatus === "Delivered" ? (
                          <div>
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                              <svg
                                className="me-1 h-3 w-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 11.917 9.724 16.5 19 7.5"
                                />
                              </svg>
                              {order.orderStatus}
                            </dd>
                          </div>
                        ) : order.orderStatus === "Cancelled" ? (
                          <div>
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                              <svg
                                className="me-1 h-3 w-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18 17.94 6M18 18 6.06 6"
                                />
                              </svg>
                              {order.orderStatus}
                            </dd>
                          </div>
                        ) : order.orderStatus === "In Transit" ? (
                          <div>
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              <svg
                                className="me-1 h-3 w-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                />
                              </svg>
                              {order.orderStatus}
                            </dd>
                          </div>
                        ) : order.orderStatus === "Pre Order" ? (
                          <div>
                            <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                              <svg
                                className="me-1 h-3 w-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                                />
                              </svg>
                              {order.orderStatus}
                            </dd>
                          </div>
                        ) : (
                          <div>
                            <svg
                              className="w-3 h-3 mr-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {order.orderStatus}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {order.paymentDetails.method}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 flex justify-center space-x-2">
                        {/* <button
                          type="button"
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </button> */}
                        <button
                          onClick={() => {
                            navigate(`/orderdetails/${order._id}`);
                          }}
                          className="px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                                    <button
              onClick={() => deleteOrder(order._id)}
              className="px-2 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700 "
            >
              Delete
            </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center">
            {totalPages > 1 && (
              <nav aria-label="Pagination">
                <ul className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li key={page}>
                        <button
                          onClick={() => paginate(page)}
                          className={`flex items-center justify-center w-10 h-10 ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700"
                          } rounded-full transition-colors`}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}
                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Order;
