import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../../store/CheckOutSlice";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.checkout);
  console.log("My Orders Data:", orders);

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  return (
    <section className="bg-gray-900 min-h-screen py-12 antialiased text-gray-300">
      <div className="mt-24 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">My Orders</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  id="order-type"
                  className="w-full sm:w-40 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all-orders">All Orders</option>
                  <option value="pre-order">Pre-order</option>
                  <option value="transit">In Transit</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <span className="hidden sm:inline text-gray-400">from</span>
              <div className="relative">
                <select
                  id="duration"
                  className="w-full sm:w-40 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-gray-200 uppercase text-xs font-semibold">
                  <th className="py-4 px-4 text-center">Order ID</th>
                  <th className="py-4 px-4 text-center">Date</th>
                  <th className="py-4 px-4 text-center">Total Amount</th>
                  <th className="py-4 px-4 text-center">Order Status</th>
                  <th className="py-4 px-4 text-center">Payment Method</th>
                  <th className="py-4 px-4 text-center">Payment Status</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        <Link to={`/productdetails/${order._id}`}>{order._id}</Link>
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        NPR {order.totalAmount}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
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
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {order.paymentDetails.method}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {order.paymentDetails.status}
                      </td>
                      <td className="py-4 px-4 flex justify-center space-x-2">
                        <button
                          type="button"
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </button>
                        <Link
                          to="#"
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
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

export default MyOrders;