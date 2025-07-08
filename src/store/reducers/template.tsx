import { createSlice } from "@reduxjs/toolkit";
import { Template } from "../../Model/TemplateModel";

const initialState: Template[] = [];


const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      return action.payload;
    },
    addTemplate: (state, action) => {
      state.push(action.payload);
    },
    updateTemplate: (state, action) => {
      const index = state.findIndex(template => template.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteTemplate: (state, action) => {
      return state.filter(template => template.id !== action.payload);
    },
    resetTemplate: (state) =>{
          return initialState
        }
  }

});

export const {setTemplates, addTemplate, updateTemplate, deleteTemplate, resetTemplate} = templateSlice.actions

export default templateSlice.reducer;