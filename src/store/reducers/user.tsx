import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../Model/UserModel";

const initialState: User[] = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {

      state.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {

      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      return state.filter((item) => item.id !== null && item.id !== action.payload);
    },
    resetUsers: (state) =>{
          return initialState
        }
  },
})
export const { setUsers, addUser, updateUser, deleteUser, resetUsers} = userSlice.actions
export default userSlice.reducer;