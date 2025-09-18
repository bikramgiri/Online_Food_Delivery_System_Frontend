import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { API, APIAuthenticated } from "../http";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
    token: "",
    // error: null, // Add error state to store API errors
    // message: "", // Add message state for success/error messages
  },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logOut: (state) => {
      state.data = [];
      state.token = null;
    },
    resetAuth: (state) => {
      state.data = [];
      state.token = "";
      state.status = STATUSES.IDLE;
    },
    // setEmail: (state, action) => {
    //   state.email = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
    // setMessage: (state, action) => {
    //   state.message = action.payload;
    // },
  },
});

export const { setUser, setStatus, setToken, logOut, resetAuth, setEmail, setError, setMessage } = authSlice.actions;
export default authSlice.reducer;

// User Registration
// export function registerUser(data){
//       return async function registerUserThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING));
//         try {
//             const response = await axios.post(`${API_URL}/auth/register`, data);
//             dispatch(setToken(response.data.data));
//             dispatch(setStatus(STATUSES.SUCCESS));
//             dispatch(setMessage("User registered successfully"));
//         } catch (error) {
//             console.log("Failed to register user:", error);
//             dispatch(setStatus(STATUSES.ERROR));
//             dispatch(setMessage("Failed to register user"));
//         }
//       }
// }

// **OR

export function registerUser(data) {
  return async function registerUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/auth/register", data);
      console.log("Register Response:", response.data); // Debug response
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to register user:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

// User Login
// export function loginUser(data){
//       return async function loginUserThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING));
//         try {
//             const response = await axios.post(`${API_URL}/auth/login`, data);
//             dispatch(setToken(response.data.data));
//             dispatch(setStatus(STATUSES.SUCCESS));
//         } catch (error) {
//             console.log("Failed to login user:", error);
//             dispatch(setStatus(STATUSES.ERROR));
//         }
//       }
// }

// **OR

export function loginUser(data) {
  return async function loginUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/auth/login", data);
      dispatch(setUser(response.data.data));
      dispatch(setToken(response.data.token));
      dispatch(setStatus(STATUSES.SUCCESS));
      // Save token to cookies
      // document.cookie = `token=${response.data.token}; path=/`;
      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.log("Failed to login user:", error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


// fetch profile
export function fetchUserProfile() {
  return async function fetchUserProfileThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/users/profile");
      dispatch(setUser(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch user profile:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


export function forgotpassword(data) {
  return async function forgotPasswordThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/auth/forgotpassword", data);
      dispatch(setUser(response.data.data));
      // dispatch(setMessage(response.data.message)); // Set the backend message
      dispatch(setStatus(STATUSES.SUCCESS));
      return response; // Return response for further handling
    } catch (error) {
      console.log("Failed to forgot password:", error);
      dispatch(setStatus(STATUSES.ERROR));
      // dispatch(setError(error.response?.data?.message || "Failed to send OTP")); // Set error message
      throw error; // Rethrow error for further handling
    }
  };
}

export function verifyotp(data) {
  return async function verifyOtpThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/auth/verifyotp", data);
      console.log("Verify OTP Response:", response.data); // Debug response
      dispatch(setUser(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      return response; // Return response for further handling
    } catch (error) {
      console.log("Failed to verify OTP:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error; // Rethrow error for further handling
    }
  };
}

export function changepassword(data) {
  return async function changepasswordThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/auth/changepassword", data);
      console.log("Change Password Response:", response.data); // Debug response
      dispatch(setUser(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      return response; // Return response for further handling
    } catch (error) {
      console.log("Failed to change password:", error);
      dispatch(setStatus(STATUSES.ERROR));
      throw error; // Rethrow error for further handling
    }
  };
}
