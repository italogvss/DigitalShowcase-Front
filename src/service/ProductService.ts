import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { Product } from '../Model/ProductModel';
import config from '../Util/config';
import { RootState } from '../store';
import { addProducts, deleteProducts, setProducts, updateProducts } from '../store/reducers/product';

const url = config.API.BASE_URL + config.API.ENDPOINTS.PRODUCTS

export const productApi = createApi({
  reducerPath: 'productApi',
  tagTypes: ['Product'],
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product[], Product[]>({
      query: (data) => ({
        url: 'createall',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: async (product, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success("Produtos criados com sucesso")
          dispatch(addProducts(data));
        } catch (error) {
          toast.error("Falha ao criar produtos")
        }
      },
    }),
    findAllProducts: builder.query<Product[], string>({
      query: (id) => ({
        url: `findall/${id}`,
        method: 'GET',
      }),
      onQueryStarted: async (product, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProducts(data))
        } catch (error) {
          toast.error("Falha ao buscar produtos")
        }
      },
    }),

    updateProducts: builder.mutation<Product, Product[]>({
      query: (data) => ({
        url: 'update',
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: async (product, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(updateProducts(product));
          toast.success("Produtos atualizados")
        } catch (error) {
          toast.error("Falha ao atualizar produtos")
        }
      },
    }),

    deleteProducts: builder.mutation<boolean, number[]>({
      query: (data) => ({
        url: 'delete',
        method: 'DELETE',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (product, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(deleteProducts(product));
        } catch (error) {
          toast.error("Falha ao deletar produtos")
        }
      },
    }),
  }),
});

// Exportando os hooks gerados automaticamente
export const {
  useCreateProductMutation,
  useFindAllProductsQuery,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
} = productApi;
