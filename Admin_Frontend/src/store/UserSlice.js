import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http/index";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    status: STATUSES.SUCCESS,
    users: []
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setStatus, setUsers } = UserSlice.actions;
export default UserSlice.reducer;

export function fetchUsers() {
  return async function fetchUsersThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/users");
      dispatch(setUsers(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch users:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

