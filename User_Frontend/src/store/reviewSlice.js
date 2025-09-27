import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http/index";

const ReviewSlice = createSlice({
  name: "review",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
    selectedReview: {},
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setReviews: (state, action) => {
      state.data = action.payload;
    },
    setSelectedReview: (state, action) => {
      state.selectedReview = action.payload;
    },
    deleteReviewById: (state, action) => {
      const index = state.data.findIndex(
        (review) => review._id === action.payload.reviewId
      );
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },
    addNewReview: (state, action) => {
      state.data.push(action.payload);
    },
},
})

export const { setStatus, setReviews, setSelectedReview, deleteReviewById, addNewReview } = ReviewSlice.actions;
export default ReviewSlice.reducer;

export function addReview(formData) {
  return async function addReviewThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const productId = formData.get("id");
      if (!productId) throw new Error("Product ID is required");
      const response = await APIAuthenticated.post(`/users/reviews/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(addNewReview(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      // Optionally, you can fetch the updated list of reviews here
      dispatch(fetchAllReviews(productId));
      // after review is added redirect to reviews page
      if (response.status === 201) {
        window.location.href = `/productdetails/${productId}`; // Redirect after adding review
      }
      return response;
    } catch (error) {
      console.log("Failed to add review:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchMyReviews() {
  return async function fetchMyReviewsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/users/reviews");
      dispatch(setReviews(response.data.data.reverse()));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch reviews:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchAllReviews(productId) {
  return async function fetchAllReviewsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      if (!productId) throw new Error("Product ID is required");
      const response = await APIAuthenticated.get(`/users/reviews/${productId}`);
      console.log("All Reviews:", response.data.data);
      dispatch(setReviews(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch reviews:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchSingleReview(reviewId) {
  return async function fetchSingleReviewThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      if (!reviewId) throw new Error("Review ID is required");
      const response = await APIAuthenticated.get(`/users/review/${reviewId}`);
      console.log("Single Review:", response.data.data);
      dispatch(setSelectedReview(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch reviews:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


export function editReview(formData) {
  return async function editReviewThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const reviewId = formData.get("id");
      if (!reviewId) throw new Error("Review ID is required");
      const response = await APIAuthenticated.patch(`/users/reviews/${reviewId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setReviews(response.data.data));
      const productId = response.data.data.productId; // Assuming the response includes productId
      if (productId) dispatch(fetchAllReviews(productId));
      dispatch(setStatus(STATUSES.SUCCESS));
      return response;
    } catch (error) {
      console.log("Failed to edit review:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

export function deleteReview(reviewId) {
  return async function deleteReviewThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await APIAuthenticated.delete(
        `/users/reviews/${reviewId}`
      );
      dispatch(deleteReviewById({ reviewId }));
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchAllReviews(reviewId)); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to delete review:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}