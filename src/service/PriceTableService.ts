import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { PriceTable } from '../Model/PriceTableModel'; // Assumindo que existe um modelo PriceTable
import config from '../Util/config';
import { RootState } from '../store';
import { addPriceTable, deletePriceTable, setPriceTables, updatePriceTable } from '../store/reducers/priceTable';
import { Product } from '../Model/ProductModel';
import { setProducts } from '../store/reducers/product';

// Definição das interfaces para os tipos esperados
export interface CreatePriceTableRequest {
  priceTable: PriceTable;
}


const url = config.API.BASE_URL + config.API.ENDPOINTS.PRICETABLE

export const priceTableApi = createApi({
  reducerPath: 'priceTableApi',
  tagTypes: ['PriceTable'],
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
    // Endpoint para criar uma Price Table
    createPriceTable: builder.mutation<PriceTable, CreatePriceTableRequest>({
      query: (data) => ({
        url: 'create',
        method: 'POST',
        body: data.priceTable,
      }),
      onQueryStarted: async (priceTable, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addPriceTable(data));
        } catch (error) {
          toast.error("Falha ao adicionar")
        }
      },
    }),

    // Endpoint para buscar todas as Price Tables
    findAllPriceTables: builder.query<PriceTable[], string>({

      providesTags: ['PriceTable'],
      query: (id) => ({
        url: `findall/${id}`,
        method: 'GET',
      }),
      onQueryStarted: async (priceTable, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setPriceTables(data))
        } catch (error) {
          toast.error("Falha ao buscar as tabelasde preço")
        }
      },
    }),

    // Endpoint para atualizar uma Price Table
    updatePriceTable: builder.mutation<PriceTable, PriceTable>({
      invalidatesTags: ['PriceTable'],
      query: (data) => ({
        url: 'update',
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: async (priceTable, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updatePriceTable(data));
        } catch (error) {
          toast.error("Falha ao atualizar")
        }
      },
    }),

    // Endpoint para deletar Price Tables por IDs
    deletePriceTable: builder.mutation<boolean, number>({
      query: (data) => ({
        url: 'delete',
        method: 'DELETE',
        body: data, // IDs enviados no corpo da requisição
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (priceTable, { dispatch, queryFulfilled, getState}) => {
        try {
          await queryFulfilled;
          dispatch(deletePriceTable(priceTable));
          dispatch(setProducts(removePriceTables((getState() as RootState).product, priceTable)))
        } catch (error) {
          toast.error("Falha ao deletar")
        }
      },
    }),
  }),
});

// Exportando os hooks gerados automaticamente
export const {
  useCreatePriceTableMutation,
  useFindAllPriceTablesQuery,
  useUpdatePriceTableMutation,
  useDeletePriceTableMutation,
} = priceTableApi;


function removePriceTables(products: Product[], priceTableId: number): Product[] {
  return products.map(product => {
    if (product.priceTableId === priceTableId) {
      return { ...product, priceTableId: null };
    }
    return product;
  });
}

