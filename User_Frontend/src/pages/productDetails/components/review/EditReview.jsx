import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { editReview, fetchSingleReview } from "../../../../store/reviewSlice";

const EditReview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Review ID from URL
  const { selectedReview: review, status } = useSelector((state) => state.review);
  console.log("Selected Review from Redux:", review);

  const [formData, setFormData] = useState({
    id: "",
    rating: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleReview(id));
    } else {
      console.error("No review ID provided for fetching review");
    }
  }, [dispatch, id]);

  const productName = review?.productId?.productName || "Unknown Product";

  useEffect(() => {
    if (review?._id) {
      setFormData({
        id: review._id,
        rating: review.rating || "",
        message: review.message || "",
      });
    }
  }, [review]);

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

  const handleRating = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { rating, message } = formData;
    if (!id) {
      setMessage("Review ID is required.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (!rating || !message) {
      setMessage("All fields are required.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (message.length < 5) {
      setMessage("Message must be at least 5 characters long.");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id", id);
    formDataToSend.append("rating", rating);
    formDataToSend.append("message", message);
    if (file) formDataToSend.append("file", file);

    try {
      await dispatch(editReview(formDataToSend));
      setMessage("Review updated successfully!");
      setTimeout(() => {
        setMessage("");
        navigate(`/productdetails/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Edit Review Error:", error.response?.data || error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to update review. Please try again.";
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleDiscard = () => {
    setFormData({
      id: id,
      rating: review?.rating || "",
      message: review?.message || "",
    });
    setFile(null);
    setMessage("Changes discarded!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (status === "LOADING") return <div>Loading...</div>;
  if (status === "ERROR") return <div>Error loading product details.</div>;

  return (
    <div className="mt-38 w-full flex items-center justify-center">
      <button
        onClick={() => navigate(`/productdetails/${review?.productId}`)}
        className="cursor-pointer mb-165 ml-8 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Back to Review Page
      </button>
      <div className="max-w-2xl w-full p-4">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              Add a review for:{" "}
              <span className="text-gray-900 dark:text-gray-400">
                {productName}
              </span>
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4 md:p-5">
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <span className="ms-2 flex justify-center text-lg font-bold text-gray-900 dark:text-white">
                  {formData.rating || "0"} out of 5
                </span>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`cursor-pointer h-6 w-6 ${
                        star <= (formData.rating || 0)
                          ? "text-yellow-300"
                          : "text-gray-300 dark:text-gray-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                      onClick={() => handleRating(star)}
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Review description
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Write your review here..."
                  required
                ></textarea>
              </div>
              <div className="col-span-1">
                <p className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Add real photos of the product to help other customers{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    (Optional)
                  </span>
                </p>
                <div className="flex w-full items-center justify-center">
                  <label
                    htmlFor="dropzone-file"
                    className="dark:hover:bg-bray-800 flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div
                      {...getRootProps()}
                      className="flex justify-center px-6 pt-5 pb-6 rounded-md text-white transition-colors duration-200 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="text-sm">Drop the image here...</p>
                      ) : file ? (
                        <p className="text-sm">{file.name}</p>
                      ) : review?.productImage ? (
                        <img
                          src={review.productImage}
                          alt="Current Product"
                          className="h-32 object-cover"
                        />
                      ) : (
                        <>
                          <div className="flex flex-col items-center justify-center pb-6 pt-5">
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
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="justify-center flex items-center border-t pt-4 dark:border-gray-700 md:pt-5">
              <button
                type="submit"
                className="cursor-pointer me-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Edit review
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="cursor-pointer me-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Discard
              </button>
            </div>
          </form>
          {message && (
            <p
              className={`text-center mb-10 ${
                message.includes("Failed") || message.includes("required")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditReview;