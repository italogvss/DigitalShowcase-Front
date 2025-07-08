
import { createSlice } from '@reduxjs/toolkit';


// Criação do slice
const drawerSlice = createSlice({
  name: 'drawer',
  initialState: true,
  reducers: {
    openDrawer: () => {
       return true 
    },
    closeDrawer: () => {
      return false
    },
    toggleDrawer: (state) => {
      return !state
    },
  },
});
export const { openDrawer, closeDrawer, toggleDrawer } = drawerSlice.actions;
export default drawerSlice.reducer