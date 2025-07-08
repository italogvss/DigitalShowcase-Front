import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Media } from "../../Model/MediaModel";

const initialState: Media[] = [];

const mediaSlice = createSlice({
  name: "midia",
  initialState,
  reducers: {
    addMedia: (state, action: PayloadAction<Media>) => {
      return [...state, action.payload].sort((a, b) => b.desc.localeCompare(a.desc));
    },
    deleteMedia: (state, action: PayloadAction<number>) => {
      return state.filter((media) => media.id !== action.payload);
    },
    updateMedia: (state, action: PayloadAction<Media>) => {
      return state.map((media) =>
        media.id === action.payload.id ? action.payload : media
      );
    },
    setMedia: (state, action: PayloadAction<Media[]>) => {
      return [...action.payload].sort((a, b) => b.desc.localeCompare(a.desc));
    },
    resetMedia: () => initialState,
  },
});

export const { addMedia, deleteMedia, updateMedia, setMedia, resetMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
