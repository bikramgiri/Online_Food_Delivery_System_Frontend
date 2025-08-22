import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import API from "../http";

const API_URL = import.meta.env.API_URL || 'http://localhost:3000';

const authSlice = createSlice({
  name: "auth",
  initialState: {
      data: [],
      status: STATUSES.SUCCESS,
      token: "",
      message: ""
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
      setMessage: (state, action) => {
          state.message = action.payload;
      }
      
    }
});

export const { setUser, setStatus, setToken, setMessage } = authSlice.actions
export default authSlice.reducer

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

export function registerUser(data){
      return async function registerUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('/auth/register', data);
            dispatch(setToken(response.data.data));
            dispatch(setStatus(STATUSES.SUCCESS));
            dispatch(setMessage("User registered successfully"));
        } catch (error) {
            console.log("Failed to register user:", error);
            dispatch(setStatus(STATUSES.ERROR));
            dispatch(setMessage("Failed to register user"));
        }
      }
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

export function loginUser(data){
      return async function loginUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.post('/auth/login', data);
            dispatch(setToken(response.data.data));
            dispatch(setStatus(STATUSES.SUCCESS));
        } catch (error) {
            console.log("Failed to login user:", error);
            dispatch(setStatus(STATUSES.ERROR));
        }
      }
}
