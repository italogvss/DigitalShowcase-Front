import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import config from "../Util/config";
import { InfoDTO } from "../Model/InfoDTO";

const url = config.API.BASE_URL + '/sysinfo';

export const sysInfoApi = createApi({
  reducerPath: 'sysInfoApi',
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
    getSystemInfo: builder.query<InfoDTO, void>({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetSystemInfoQuery, useLazyGetSystemInfoQuery } = sysInfoApi;