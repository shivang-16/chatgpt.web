import { IUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface UserProps {
  user: IUser | null;
}

const initialState: UserProps = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userData: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { userData } = userSlice.actions;

export default userSlice.reducer;
