import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../../store/productSlice";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    productStockQty: "",
    productPrice: "",
    productStatus: "Available",
    productDescription: "",
  });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg",
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      productName,
      productStockQty,
      productPrice,
      productStatus,
      productDescription,
    } = formData;
    if (
      !productName ||
      !file ||
      !productStockQty ||
      !productPrice ||
      !productStatus ||
      !productDescription
    ) {
      setMessage("All fields are required, including an image.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (parseInt(productStockQty) < 0) {
      setMessage("Product stock quantity must be a positive number.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (parseFloat(productPrice) < 0) {
      setMessage("Product price must be a positive number.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (!["Available", "Unavailable"].includes(productStatus)) {
      setMessage("Product status must be either 'Available' or 'Unavailable'.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (productDescription.length < 10) {
      setMessage("Product description must be at least 10 characters long.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("productName", productName);
    formDataToSend.append("productStockQty", productStockQty);
    formDataToSend.append("productPrice", productPrice);
    formDataToSend.append("productStatus", productStatus);
    formDataToSend.append("productDescription", productDescription);
    if (file) formDataToSend.append("file", file);

    dispatch(addProduct(formDataToSend))
      .then(() => {
        setMessage("Product added successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/admin/products");
        }, 2000);
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message ||
          "Failed to add product. Please try again.";
        setMessage(errorMsg);
        setTimeout(() => setMessage(""), 2000);
      });
  };

  const handleSchedule = () => {
    setMessage("Product scheduled for later submission!");
    setTimeout(() => setMessage(""), 2000);
    // Add logic for scheduling (e.g., save form data and process later)
  };

  const handleDiscard = () => {
    setFormData({
      productName: "",
      productStockQty: "",
      productPrice: "",
      productStatus: "Available",
      productDescription: "",
    });
    setFile(null);
    setMessage("Form discarded successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <section className="bg-gray-900 min-h-screen py-12 antialiased text-gray-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Add New Product
          </h2>
          {message && (
            <p
              className={`text-center mb-4 ${
                message.includes("Failed") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-200"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="productImage"
                className="block text-sm font-medium text-gray-200"
              >
                Product Image
              </label>
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 rounded-md bg-gray-700 text-white transition-colors duration-200 cursor-pointer"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-sm">Drop the image here...</p>
                ) : file ? (
                  <p className="text-sm">{file.name}</p>
                ) : (
                  // make below svg and text centered
                  <div className="flex flex-col justify-center items-center space-x-2">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, JPEG or GIF (MAX. 1MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="productStockQty"
                className="block text-sm font-medium text-gray-200"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="productStockQty"
                name="productStockQty"
                value={formData.productStockQty}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-200"
              >
                Price (NPR)
              </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label
                htmlFor="productStatus"
                className="block text-sm font-medium text-gray-200"
              >
                Status
              </label>
              <select
                id="productStatus"
                name="productStatus"
                value={formData.productStatus}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-gray-200"
              >
                Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="cursor-pointer w-full inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Product
              </button>
              <button
                type="button"
                onClick={handleSchedule}
                className="cursor-pointer w-full inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Schedule
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="cursor-pointer w-full inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
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
                Discard
              </button>
            </div>
            {/* display product added success message in green color */}
            {message && (
              <p className="text-green-500 text-center mb-8">{message}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
