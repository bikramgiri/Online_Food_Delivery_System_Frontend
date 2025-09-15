import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { API, APIAuthenticated } from "../http";
import { fetchUsers } from "./UserSlice";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
    token: "",
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
  },
});

export const { setUser, setStatus, setToken, logOut, resetAuth } = authSlice.actions;
export default authSlice.reducer;

export function loginUser(data) {
  return async function loginUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post("/auth/login", data);
      dispatch(setUser(response.data.data));
      dispatch(setToken(response.data.token));
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchUsers());
      if(response.status === 200 && response.data.token){
        // Save token to cookies
        // document.cookie = `token=${response.data.token}; path=/`;
        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        window.location.href = "/admin"; // Redirect to admin dashboard
      }
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

