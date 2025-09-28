import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteReview, fetchMyReviews } from "../../../../store/reviewSlice";
import { STATUSES } from "../../../../global/statuses";

const MyReviews = () => {
const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { data: reviews, status } = useSelector((state) => state.review);
  console.log("Reviews:", reviews);
  const { id } = useParams();

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
  const itemsPerPage = 2; // Number of items per page

  // Filter and sort state
  const [filter, setFilter] = useState("allstar");
  const [sort, setSort] = useState("default");

  // Filter reviews
  const hasRating = (rating) => Array.isArray(reviews) && reviews.some((r) => r.rating === rating);
  const filteredReviews = Array.isArray(reviews)
    ? (filter === "allstar"
        ? reviews
        : reviews.filter((r) => r.rating === parseInt(filter.replace("star", ""))))
    : [];

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sort) {
      case "recent":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil((sortedReviews.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    dispatch(fetchMyReviews(id));
    // Reset to first page when reviews, filter, or sort changes
    setCurrentPage(1);
  }, [dispatch, filter, id, sort]); // Added filter and sort as dependencies

  const loggedInUserId = localStorage.getItem("userId");

  const handleDelete = (reviewId) => {
    dispatch(deleteReview(reviewId));
    if (status === STATUSES.SUCCESS) {
      setMessage("Review deleted successfully.");
      setTimeout(() => {
        setMessage("");
        dispatch(fetchMyReviews()); // Refetch reviews after deletion
        setCurrentPage(1); // Reset to first page after deletion
      }, 2000);
    } else if (status === STATUSES.ERROR) {
      setMessage("Failed to delete review. Please try again.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (status === STATUSES.LOADING) return <div>Loading...</div>;
//   if (status === STATUSES.ERROR) return <div>Error fetching reviews. Please try again later.</div>;

  return (
    <section className="bg-gray-700 mt-20 py-8 antialiased dark:bg-gray-700 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {reviews?.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 py-3">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                My Reviews on Products
              </h2>
              <div className="flex flex-row sm:flex-row gap-4">
                <div className="flex flex-row gap-1">
                  <svg
                    className="h-6 w-6 mt-3 text-gray-700 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 2v-7.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <p className="text-xl mt-3 font-medium text-gray-700 dark:text-gray-300">Filter:</p>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="cursor-pointer mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="allstar">All Stars</option>
                    <option value="5star" disabled={!hasRating(5)}>5 Stars</option>
                    <option value="4star" disabled={!hasRating(4)}>4 Stars</option>
                    <option value="3star" disabled={!hasRating(3)}>3 Stars</option>
                    <option value="2star" disabled={!hasRating(2)}>2 Stars</option>
                    <option value="1star" disabled={!hasRating(1)}>1 Star</option>
                  </select>
                </div>
                <div className="flex flex-row gap-1">
                  <svg
                    className="h-6 w-6 mt-3 text-gray-700 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h14M3 6h18M3 14h10m-8 4h6" />
                  </svg>
                  <p className="text-xl mt-3 font-medium text-gray-700 dark:text-gray-300">Sort:</p>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="cursor-pointer mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="default">Default</option>
                    <option value="recent">Recent</option>
                    <option value="highest">Rating: High to Low</option>
                    <option value="lowest">Rating: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {currentItems.length > 0 ? (
            currentItems.map((review) => (
            <div key={review._id} className="gap-3 py-6 sm:flex sm:items-start">
              <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ratings & Reviews of {review.productId?.productName || "Unknown Product"}
                 </p>
                <div className="flex mt-6 items-center gap-0.5">
                  {[...Array(review.rating)].map((_, index) => (
                    <svg
                      key={index}
                      className="h-4 w-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  ))}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-normal text-gray-300 dark:text-gray-300">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1">
                  <svg
                    className="h-5 w-5 text-green-400 dark:text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Verified purchase
                  </p>
                </div>
              </div>
              <div className="ml-10 min-w-0 flex-1 space-y-4 sm:mt-0">
                {review.productImage && (
                  <img
                    src={review.productImage}
                    alt="Review image"
                    className="h-22 w-24 rounded-lg object-cover"
                  />
                )}
                <p className="text-base font-normal text-white dark:text-white">
                  {review.message}
                </p>
                {review.userId?._id === loggedInUserId && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        navigate(`/editreview/${review._id}`);
                      }}
                      className="px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-2 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
))
          ) : (
            <div className="text-center py-6 text-white">No reviews available.</div>
          )}
          {message && <div className="justify-center items-center text-green-600 font-medium mt-3">{message}</div>}
        </div>
      
      
      <div className="mt-8 flex justify-center">
            {totalPages > 1 && (
              <nav aria-label="Pagination">
                <ul className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex cursor-pointer items-center justify-center w-10 h-10 text-white hover:text-gray-400 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className={`cursor-pointer flex items-center justify-center w-10 h-10 ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-white hover:text-gray-400 hover:bg-gray-700"
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
                      className="flex cursor-pointer items-center justify-center w-10 h-10 text-white hover:text-gray-400 hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </section>
  );
};

export default MyReviews;