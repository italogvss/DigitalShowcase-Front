import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { UserAuth } from "../../Model/UserModel";

export type AuthState = {
  user: UserAuth | null
  token: string | null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials: (state,{ payload: { user, token },}: PayloadAction<AuthState>,
    ) => {
      state.user = user
      state.token = token
    },
    
  },
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user