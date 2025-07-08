import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../Util/config';
import { RootState } from '../store';
import { DeviceSessionDTO, UpdateDeviceName } from '../Model/DeviceSession';
import { toast } from 'react-toastify';


const url = config.API.BASE_URL + config.API.ENDPOINTS.DEVICESESSION

export const deviceApi = createApi({
  reducerPath: 'deviceApi',
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

    findAllDeviceSession: builder.query<DeviceSessionDTO[], string>({
      query: (id) => ({
        url: `findall/${id}`,
        method: 'GET',
      })
      
    }),
    broadcastUserUpdate: builder.mutation<void, string>({
      query: (id) => ({
        url: `broadcastUpdate/${id}`,
        method: 'PUT',
      }),
      
    }),
    broadcastPlaylistUpdate: builder.mutation<void, string>({
      query: (id) => ({
        url: `broadcastPlaylist/${id}`,
        method: 'PUT',
      }),
      
    }),
    updateName: builder.mutation<void, UpdateDeviceName>({
      query: (data) => ({
        url: "updateName",
        method: 'PUT',
        body: data
      }),
      onQueryStarted: async (dto, { dispatch, queryFulfilled }) => {
              try {
                await queryFulfilled;                
              } catch (error) {
                toast.error("Falha ao atualizar nome da service");
              }
            },
    }),
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
      }),
      
    }),
  }),
});

export const {
  useFindAllDeviceSessionQuery,
  useUpdateNameMutation,
  useLazyFindAllDeviceSessionQuery,
  useBroadcastUserUpdateMutation,
  useDeleteSessionMutation,
  useBroadcastPlaylistUpdateMutation,
} = deviceApi;


