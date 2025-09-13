import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSingleProduct, editProduct } from "../../../store/productSlice";
import { useDropzone } from "react-dropzone";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, status } = useSelector((state) => state.product);
  const product = selectedProduct?.product;

  const [formData, setFormData] = useState({
    id: id,
    productName: "",
    productStockQty: "",
    productPrice: "",
    productStatus: "Available",
    productDescription: "",
  });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchSingleProduct(id)).catch((error) =>
      console.log("Fetch error:", error)
    );
  }, [dispatch, id]);

  useEffect(() => {
    if (product?._id) {
      setFormData({
        id: product._id,
        productName: product.productName || "",
        productStockQty: product.productStockQty || "",
        productPrice: product.productPrice || "",
        productStatus: product.productStatus || "Available",
        productDescription: product.productDescription || "",
      });
    }
  }, [status, product, selectedProduct]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { productName, productStockQty, productPrice, productStatus, productDescription } = formData;
    if (!productName || !productStockQty || !productPrice || !productStatus || !productDescription) {
      setMessage("All fields are required.");
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
    formDataToSend.append("id", id);
    formDataToSend.append("productName", productName);
    formDataToSend.append("productStockQty", productStockQty);
    formDataToSend.append("productPrice", productPrice);
    formDataToSend.append("productStatus", productStatus);
    formDataToSend.append("productDescription", productDescription);
    if (file) formDataToSend.append("file", file);

    try {
      await dispatch(editProduct(formDataToSend));
      setMessage("Product updated successfully!");
      setTimeout(() => {
        setMessage("");
        navigate(`/admin/products/${product._id}`);
      }, 2000);
    } catch (error) {
      console.error("Edit Product Error:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || "Failed to update product. Please try again.";
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleDiscard = () => {
    setFormData({
      id: id,
      productName: product?.productName || "",
      productStockQty: product?.productStockQty || "",
      productPrice: product?.productPrice || "",
      productStatus: product?.productStatus || "Available",
      productDescription: product?.productDescription || "",
    });
    setFile(null);
    setMessage("Changes discarded!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (status === "LOADING") return <div>Loading...</div>;
  if (status === "ERROR") return <div>Error loading product details.</div>;

  return (
    <section className="bg-gray-900 min-h-screen py-12 antialiased text-gray-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Edit Product</h2>
          {message && <p className={`text-center mb-4 ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-200">
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
              <label htmlFor="productImage" className="block text-sm font-medium text-gray-200">
                Product Image
              </label>
              <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 rounded-md bg-gray-700 text-white transition-colors duration-200 cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-sm">Drop the image here...</p>
                ) : file ? (
                  <p className="text-sm">{file.name}</p>
                ) : product?.productImage ? (
                  <img src={product.productImage} alt="Current Product" className="h-32 object-cover" />
                ) : (
                  <div className="flex flex-col justify-center items-center space-x-2">
                    <svg className="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16V4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16Z"/>
                      <path d="M8 10L12 6L16 10"/>
                      <path d="M12 6V14"/>
                    </svg>
                    <p className="text-sm mt-3">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max. 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="productStockQty" className="block text-sm font-medium text-gray-200">
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
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-200">
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
              <label htmlFor="productStatus" className="block text-sm font-medium text-gray-200">
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
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-200">
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
                className="w-full inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Update Product
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="w-full inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;