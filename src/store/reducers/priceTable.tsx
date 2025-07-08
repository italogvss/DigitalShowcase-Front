import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PriceTable } from "../../Model/PriceTableModel";
const initialState: PriceTable[] = [];

const priceTableSlice = createSlice({
  name: "pricetable",
  initialState,
  reducers: {
    setPriceTables: (state, action: PayloadAction<PriceTable[]>) => {
      return [...action.payload].sort((a, b) => a.name.localeCompare(b.name));
    },
    addPriceTable: (state, action: PayloadAction<PriceTable>) => {
      return [...state, action.payload].sort((a, b) => a.name.localeCompare(b.name));
    },
    updatePriceTable: (state, action: PayloadAction<PriceTable>) => {
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    deletePriceTable: (state, action: PayloadAction<number>) => {
      return state.filter((item) => item.id !== action.payload);
    },
    resetPriceTable: () => initialState,
  },
});

export const {
  setPriceTables,
  addPriceTable,
  updatePriceTable,
  deletePriceTable,
  resetPriceTable,
} = priceTableSlice.actions;

export default priceTableSlice.reducer;