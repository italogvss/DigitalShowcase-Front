import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { PriceTableLayout } from "../Model/FullPlaylistModel";
import { RootState } from "../store";
import config from "../Util/config";

export interface CreatePriceTableLayoutRequest {
  priceTableLayouts: PriceTableLayout[];
}

const url = config.API.BASE_URL + config.API.ENDPOINTS.PRICETABLELAYOUT;

export const priceTableLayoutApi = createApi({
  reducerPath: 'priceTableLayoutApi',
  tagTypes: ['PriceTableLayout'],
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
    // Criar um PriceTableLayout
    createPriceTableLayout: builder.mutation<PriceTableLayout[], CreatePriceTableLayoutRequest>({
      query: (data) => ({
        url: 'create',
        method: 'POST',
        body: data.priceTableLayouts,
      }),
      onQueryStarted: async (priceTableLayout, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          toast.error("Falha ao adicionar PriceTableLayout");
        }
      },
    }),

    // Buscar todos os PriceTableLayouts por Playlist ID
    findByPlaylist: builder.query<PriceTableLayout[], string>({
      providesTags: ['PriceTableLayout'],
      query: (id) => ({
        url: `findByPlaylist/${id}`,
        method: 'GET',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          toast.error("Falha ao buscar os PriceTableLayouts");
        }
      },
    }),

    // Atualizar os PriceTableLayouts de uma Playlist
    updatePriceTableLayouts: builder.mutation<PriceTableLayout[], PriceTableLayout[]>({
      invalidatesTags: ['PriceTableLayout'],
      query: (data) => ({
        url: 'update',
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          toast.error("Falha ao atualizar os PriceTableLayouts");
        }
      },
    }),
  }),
});

// Exportando os hooks gerados automaticamente
export const {
  useCreatePriceTableLayoutMutation,
  useFindByPlaylistQuery,
  useUpdatePriceTableLayoutsMutation,
} = priceTableLayoutApi;
