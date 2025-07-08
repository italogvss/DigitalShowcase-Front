import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { RootState } from '../store';
import { Media, MediaData } from '../Model/MediaModel';
import { addMedia, setMedia, deleteMedia, updateMedia } from '../store/reducers/media';
import { config } from '../Util/config';



const url = config.API.BASE_URL + config.API.ENDPOINTS.MEDIA
export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  tagTypes: ['Media'],
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
    createMedia: builder.mutation<Media, MediaData>({
      query: (file) => {
        const formData = new FormData();
        formData.append("userId", file.userId.toString());
        formData.append("desc", file.desc);
        formData.append("sec", file.sec);
        formData.append("file", file.data);
        return {
          url: 'create',
          method: 'POST',
          body: formData,
        };
      },
      onQueryStarted: async (file, { dispatch, getState, queryFulfilled }) => {

        try {
          const { data } = await queryFulfilled;
          const dataWithToken = data//setToken(data, (getState() as RootState))
          dispatch(addMedia(dataWithToken));
        } catch (error) {
          toast.error(`Falha ao fazer upload do arquivo ${file.desc}`);
        }
      },
    }),
    findAllMedia: builder.query<Media[], string>({
      query: (id) => `findall/${id}`,
      onQueryStarted: async (id, { dispatch, getState, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const dataWithToken = data//setTokenList(data, (getState() as RootState))
          dispatch(setMedia(dataWithToken));
        } catch (error) {
          toast.error("Falha ao buscar conteúdo");
        }
      },
    }),
    deleteMedia: builder.mutation<void, number>({
      query: (ids) => ({
        url: 'delete',
        method: 'DELETE',
        body: ids,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(deleteMedia(id));
        } catch (error) {
          toast.error("Falha oa deletar conteúdo");
        }
      },
    }),
    updateMedia: builder.mutation<Media, Media>({
      query: (media) => ({
        url: 'update',
        method: 'PUT',
        body: media,
      }),
      onQueryStarted: async (media, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateMedia(media));
        } catch (error) {
          toast.error("Falha ao atualizar a midia");
        }
      },
    }),
  }),
});

export const {
  useCreateMediaMutation,
  useFindAllMediaQuery,
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} = mediaApi;

function setToken(data: Media, state: RootState) {
  const token = state.auth.token
  return {
    ...data,
    url: token ? `${data.url}?token=${token}` : data.url,
    urlPreview: token ? `${data.urlPreview}?token=${token}` : data.urlPreview,
  };
}

function setTokenList(data: Media[], state: RootState) {
  const token = state.auth.token;
  
  return data.map((item) => ({
    ...item,
    url: token ? `${item.url}?token=${token}` : item.url,
    urlPreview: token ? `${item.urlPreview}?token=${token}` : item.urlPreview,
  }));
}
