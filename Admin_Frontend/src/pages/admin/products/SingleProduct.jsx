import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProduct, fetchOrdersOfProduct, fetchSingleProduct, updateProductStatus, updateProductStockQty } from "../../../store/productSlice";
import { STATUSES } from "../../../global/statuses";
// import { fetchOrders } from "../../../store/orderSlice";

const SingleProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [productStockQty, setProductStockQty] = useState("");
  const [activeForm, setActiveForm] = useState(null); // Track which form is open: "orderStatus" or "paymentStatus"
  const { id } = useParams();
  const { selectedProduct, status } = useSelector((state) => state.product);
  const product = selectedProduct.product;
  const reviews = selectedProduct.productReviews;

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
    if (status === STATUSES.SUCCESS) {
      setMessage("Product deleted successfully");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

    const handleProductStatus =  () => {
      try {
        dispatch(updateProductStatus(id, productStatus ));
        setMessage("Product status updated successfully");
        setTimeout(() => {
          setMessage("");
          setActiveForm(null);
        }, 2000);
      } catch (error) {
        console.error("Error updating product status:", error);
        setMessage("Failed to update product status");
        setTimeout(() => setMessage(""), 2000);
      }
    };

      const handleProductStockQty =  () => {
      try {
        dispatch(updateProductStockQty(id, productStockQty ));
        setMessage("Product stock quantity updated successfully");
        setTimeout(() => {
          setMessage("");
          setActiveForm(null);
        }, 2000);
      } catch (error) {
        console.error("Error updating product stock quantity:", error);
        setMessage("Failed to update product stock quantity");
        setTimeout(() => setMessage(""), 2000);
      }
    };



    // **Order of the Product

      const { orders } = useSelector((state) => state.product);
      console.log("Orders of Product:", orders); // Debug orders
      const [selectedItem, setSelectedItem] = useState("all-orders");
      const [selectedTime, setSelectedTime] = useState("all");
      const [searchTerm, setSearchTerm] = useState("");
      const [date, setDate] = useState("");
    
      useEffect(() => {
      dispatch(fetchOrdersOfProduct(id));
    }, [dispatch, id]);
    
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
      const itemsPerPage = 5; // Number of items per page
    
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

  return (
    <>
      <section className=" min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="cursor-pointer items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Products Page
        </button>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="mx-auto 6xl:px-2">
            {/* <div className=" xl:gap-16"> */}
            <div className="p-10 md:p-12 lg:px-16 lg:py-20">
              <div className="rounded-lg mb-2 border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-4">
                <img
                  className="w-full hidden dark:block rounded-xl"
                  src={product?.productImage}
                  alt={product?.productName}
                />
              </div>
              <h1 className="mt-4 text-3xl font-medium text-gray-900 dark:text-white">
                {product?.productName}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                  NPR {product?.productPrice}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    (5.0)
                  </p>
                  <Link
                    to="#"
                    className="text-sm font-medium leading-none text-gray-900 hover:no-underline dark:text-white"
                  >
                    {reviews?.length} Reviews
                  </Link>
                </div>
              </div>
              {/* Product Status */}
              <div className="mt-2 flex gap-6 mt-6">
                {/* make: if status is available that show in green color, if status is unavailable then show in red color */}
                <p className="text-sm font-medium leading-none dark:text-white">
                  Status:{" "}
                  <span
                    className={`${
                      product?.productStatus === "Available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {product?.productStatus}
                  </span>
                </p>
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                  Stock Quantity: {product?.productStockQty}
                </p>
              </div>

              <p className="mt-6 text-gray-500 dark:text-gray-400">
                {product?.productDescription}
              </p>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8 lg:gap-6">
                <button
                  onClick={() => navigate(`/admin/products/editproduct/${product?._id}`)}
                  type="button"
                  className="cursor-pointer flex items-center rounded-lg px-4 py-2.5 text-sm font-medium border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                  <button
                  id="updateProductStatus"
                  onClick={() => setActiveForm("productStatus")}
                  className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200 w-full md:w-auto"
                >
                  Update Product Status
                </button>
                <button
                  id="updateProductStockQty"
                  onClick={() => setActiveForm("productStockQty")}
                  className="cursor-pointer px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition duration-200 w-full md:w-auto"
                >
                  Update Product StockQty
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  type="button"
                  className="cursor-pointer flex items-center rounded-lg px-4 py-2.5 text-sm font-medium dark:text-white border-transparent dark:bg-red-600 dark:hover:bg-red-700"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
              {message && (
                <p className="text-green-500 text-center mb-8">{message}</p>
              )}

          {activeForm === "productStatus" && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-500 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Update Product Status
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProductStatus();
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
                    value={productStatus}
                    onChange={(e) => setProductStatus(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // make: disable the button if productStatus is current productStatus
                    disabled={productStatus === product?.productStatus}
                    className="cursor-pointer px-4 py-2 bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
)}
                      {activeForm === "productStockQty" && (
            <div className="mb-20 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-500 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Update Product Stock Quantity
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProductStockQty();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="stockQty"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="stockQty"
                    value={productStockQty || product?.productStockQty || ""}
                    min="0"
                    onChange={(e) => setProductStockQty(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // make: disable the button if productStockQty is current productStockQty
                    disabled={productStockQty === product?.productStockQty}
                    className="cursor-pointer px-4 py-2 bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
)}
            </div>
            {/* </div> */}
          </div>
        </div>





        {/* Orders of this Product */}
        {
          orders && orders.length > 0 ? (
        <div className="mt-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <option value="in transit">In Transit</option>
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
                  <th className="py-4 px-4 text-center">User </th>
                  <th className="py-4 px-4 text-center">Number</th>
                  <th className="py-4 px-4 text-center">Shipping Address</th>
                  <th className="py-4 px-4 text-center">Order Status</th>
                  <th className="py-4 px-4 text-center">Payment Method</th>
                  <th className="py-4 px-4 text-center">Payment Status</th>
                  <th className="py-4 px-4 text-center">Total Quantity</th>
                  <th className="py-4 px-4 text-center">Total Amount</th>
                  <th className="py-4 px-4 text-center">Date</th>
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
                       {order.user.phoneNumber}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {order.shippingAddress}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {order.orderStatus === "pending" ? (
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
                        ) : order.orderStatus === "delivered" ? (
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
                        ) : order.orderStatus === "cancelled" ? (
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
                        ) : order.orderStatus === "in transit" ? (
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
                        ) : order.orderStatus === "pre-order" ? (
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
                        {order.paymentDetails.status }
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {order.items[0]?.quantity}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        NPR {order.items[0]?.quantity * product?.productPrice}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {formatDate(order.createdAt)}
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
      ) : (
        <p className="py-4 text-center text-gray-400">No orders found for this product.</p>
      )}

      </section>
    </>
  );
};

export default SingleProduct;
