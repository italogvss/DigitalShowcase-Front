import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist } from "../../Model/PlaylistModel";

const initialState: Playlist[] = []

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Playlist[]>) => {
      return action.payload
    },
    addPlaylist: (state, action: PayloadAction<Playlist>)=>{
      state.push(action.payload)
    },
    deletePlaylist: (state, action: PayloadAction<number>) => {
      return state.filter((item) => item.id !== null && item.id !== action.payload);
    },
    updatePlaylist: (state, action) => {
      const index = state.findIndex(playlist => playlist.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    resetPlaylist: (state) =>{
      return initialState
    }
  }

})

export const {addPlaylist,deletePlaylist,updatePlaylist, setPlaylist, resetPlaylist} = playlistSlice.actions
export default playlistSlice.reducer