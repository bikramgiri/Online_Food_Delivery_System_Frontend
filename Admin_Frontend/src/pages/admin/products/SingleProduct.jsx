import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProduct, fetchSingleProduct, updateProductStatus, updateProductStockQty } from "../../../store/productSlice";
import { STATUSES } from "../../../global/statuses";

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

  return (
    <>
      <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // make: disable the button if productStatus is current productStatus
                    disabled={productStatus === product?.productStatus}
                    className="px-4 py-2 bg-blue-600 dark:text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
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
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // make: disable the button if productStockQty is current productStockQty
                    disabled={productStockQty === product?.productStockQty}
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
            {/* </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
