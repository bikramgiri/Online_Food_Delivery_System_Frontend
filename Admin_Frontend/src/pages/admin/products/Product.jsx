import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProduct, fetchProducts } from "../../../store/productSlice";
import { STATUSES } from "../../../global/statuses";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { products, status } = useSelector((state) => state.product);
  const [selectedItem, setSelectedItem] = useState("all-products");
  const [selectedTime, setSelectedTime] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null); // Track which product's menu is open

  useEffect(() => {
    dispatch(fetchProducts());
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
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter products based on selected item
  const filteredProducts =
    selectedItem === "all-products"
      ? currentProducts
      : currentProducts.filter((product) => product.productStatus?.toLowerCase() === selectedItem.toLowerCase());

  // Filter products based on selected time
  const timeFilteredProducts = filteredProducts.filter((product) => {
    const productDate = new Date(product.createdAt);
    const now = new Date();

    switch (selectedTime) {
      case "today":
        return productDate >= new Date(now.setHours(0, 0, 0, 0));
      case "this-week":
        return productDate >= new Date(now.setDate(now.getDate() - now.getDay()));
      case "this-month":
        return productDate >= new Date(now.getFullYear(), now.getMonth(), 1);
      case "last-3-months":
        return productDate >= new Date(now.setMonth(now.getMonth() - 3));
      case "last-6-months":
        return productDate >= new Date(now.setMonth(now.getMonth() - 6));
      case "this-year":
        return productDate >= new Date(now.getFullYear(), 0, 1);
      default:
        return true;
    }
  });

  // Search functionality
  const searchedProducts = timeFilteredProducts.filter(
    (product) =>
      product._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productStockQty.toString().includes(searchTerm.toString()) ||
      product.productPrice.toString().includes(searchTerm.toString()) ||
      formatDate(product.createdAt).includes(searchTerm.toString())
  );

  // Date filter functionality but show all if date is not selected
  const dateFilteredProducts = searchedProducts.filter((product) => {
    const productDate = new Date(product.createdAt);
    const selectedDate = new Date(date);
    return date
      ? productDate.toDateString() === selectedDate.toDateString()
      : true;
  });

    const handleDeleteProduct = (id) => {
      dispatch(deleteProduct(id));
      if (status === STATUSES.SUCCESS) {
        setMessage("Product deleted successfully");
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
            <h2 className="text-3xl font-bold text-white mb-4 sm:mb-0">
              Products
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  onChange={(e) => setSelectedItem(e.target.value)}
                  id="order-type"
                  className="w-full sm:w-40 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all-products">All Products</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
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
          <div className="mb-4 flex">
            <h2 className="text-2xl font-medium text-gray-200">Products List</h2>
            {/* <button
              onClick={() => navigate("/addproduct")}
              className="ml-auto cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button> */}
            <button
            onClick={() => navigate("/addproduct")}
      type="button"
      className="ml-auto inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 "
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      Add New Product
    </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-gray-200 uppercase text-xs font-semibold">
                  <th className="py-4 px-4 text-center">Product ID</th>
                  <th className="py-4 px-4 text-center">Name</th>
                  <th className="py-4 px-4 text-center">Price</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Stock Quantity</th>
                  <th className="py-4 px-4 text-center">Created At</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dateFilteredProducts.length > 0 ? (
                  dateFilteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {product._id}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        {product.productName}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-100">
                        NPR {product.productPrice}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {product.productStatus === "Available" ? (
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
                              {product.productStatus}
                            </dd>
                          </div>
                        ) : product.productStatus === "Unavailable" ? (
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
                              {product.productStatus}
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
                            {product.productStatus}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {product.productStockQty}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-100">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="py-4 px-4 flex justify-center space-x-2">
                        {/* <button
                          type="button"
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </button> */}
                        {/* <button
                          onClick={() => {
                            navigate(`/productdetails/${product._id}`);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button> */}
                                                <div className="flex justify-center">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === product._id ? null : product._id)}
                            className="cursor-pointer p-2 dark:text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                          >
                            {/* make below svg icon horizontal three dots */}
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M6 12h.01M12 12h.01M18 12h.01"
                              />
                            </svg>
                          </button>
                        </div>
                        {openMenuId === product._id && (
                          <div className="absolute right-[60px] mt-14 py-2 w-35 bg-gray-700 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => {
                                // Handle Edit action (e.g., navigate to edit page)
                                console.log("Edit product:", product._id);
                                setOpenMenuId(null);
                              }}
                              className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-t-md focus:outline-none"
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
                              onClick={() => {
                                // Handle View action (e.g., navigate to view page)
                                console.log("View product:", product._id);
                                setOpenMenuId(null);
                              }}
                              className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600 focus:outline-none"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-600 rounded-b-md focus:outline-none"
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
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-400">
                      No products found.
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

export default Product;
