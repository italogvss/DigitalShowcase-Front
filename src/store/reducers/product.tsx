import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../Model/ProductModel";

const initialState: Product[] = [];

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      return action.payload;
    },
    addProducts: (state, action: PayloadAction<Product[]>) => {

      state.push(...action.payload);
    },
    updateProducts: (state, action: PayloadAction<Product[]>) => {

      action.payload.forEach(updatedProduct => {
        const index = state.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
          state[index] = updatedProduct;
        }
      });
    },
    deleteProducts: (state, action: PayloadAction<number[]>) => {

      return state.filter(product => product.id !== null && !action.payload.includes(product.id));
    },
    resetProduct: (state) =>{
          return initialState
        }
  }
});

export const {setProducts, addProducts, updateProducts, deleteProducts, resetProduct} = productSlice.actions

export default productSlice.reducer;