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
    deleteUserById: (state, action) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload.userId
      );
      if (index !== -1) {
        state.users.splice(index, 1);
      }
    },
  },
});

export const { setStatus, setUsers, deleteUserById } = UserSlice.actions;
export default UserSlice.reducer;

export function fetchUsers() {
  return async function fetchUsersThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/users");
      dispatch(setUsers(response.data.data.reverse()));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch users:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function deleteUser(userId) {
  return async function deleteUserThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      await APIAuthenticated.delete(
        `/admin/users/${userId}`
      );
      dispatch(deleteUserById({ userId }));
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchUsers()); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to fetch user:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}