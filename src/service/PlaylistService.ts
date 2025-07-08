import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { Playlist, PlaylistDTO } from '../Model/PlaylistModel';
import { Media } from '../Model/MediaModel';
import { PriceTable } from '../Model/PriceTableModel';
import config from '../Util/config';
import { RootState } from '../store';
import { addPlaylist, deletePlaylist, setPlaylist, updatePlaylist } from '../store/reducers/playlist';
import { FullPlaylist } from '../Model/FullPlaylistModel';

export default interface CreatePlaylistRequest {
  playlist: PlaylistDTO;
}
export interface UpdatePlaylistRequest {
  playlist: PlaylistDTO;
}

const url = config.API.BASE_URL + config.API.ENDPOINTS.PLAYLIST

export const playlistApi = createApi({
  reducerPath: 'playlistApi',
  tagTypes: ['Playlist'],
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
    createPlaylist: builder.mutation<PlaylistDTO, CreatePlaylistRequest>({
      query: (data) => ({
        url: 'create',
        method: 'POST',
        body: data.playlist,
      }),
      onQueryStarted: async (playlist, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
          const newPlaylist = buildPlaylist([data], (getState() as RootState))
          dispatch(addPlaylist(newPlaylist[0]));
        } catch (error) {
          toast.error("Falha ao adicionar")
        }
      },
    }),

    findAllPlaylists: builder.query<PlaylistDTO[], string>({
      providesTags: ['Playlist'],
      query: (id) => ({
        url: `findall/${id}`,
        method: 'GET',
      }),
      onQueryStarted: async (playlist, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
          const newPlaylist = buildPlaylist(data, (getState() as RootState))
           dispatch(setPlaylist(newPlaylist))
           
        } catch (error) {
          toast.error("Falha ao buscar as tabelasde preço")
        }
      },
    }),

    updatePlaylist: builder.mutation<PlaylistDTO, UpdatePlaylistRequest>({
      invalidatesTags: ['Playlist'],
      query: (data) => ({
        url: 'update',
        method: 'PUT',
        body: data.playlist,
      }),
      onQueryStarted: async (playlist, { dispatch, queryFulfilled, getState}) => {
        try {
          const { data } = await queryFulfilled;
          const newPlaylist = buildPlaylist([data], (getState() as RootState))
          dispatch(updatePlaylist(newPlaylist[0]));
        } catch (error) {
          toast.error("Falha ao atualizar")
        }
      },
    }),

    // Endpoint para deletar Price Tables por IDs
    deletePlaylist: builder.mutation<boolean, number>({
      query: (data) => ({
        url: 'delete',
        method: 'DELETE',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (playlist, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(deletePlaylist(playlist));
        } catch (error) {
          toast.error("Falha ao deletar")
        }
      },
    }),
    findByCode: builder.query<FullPlaylist, string>({
      query: (code) => ({
        url: `findByCode/${code}`,
        method: 'GET',
      }),
      onQueryStarted: async (playlist, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          toast.error("Falha ao buscar a playlist")
        }
      },
    }),
  }),
});

 export function toPlaylistDTO(playlist: Playlist): PlaylistDTO {
  return {
    id: playlist.id,
    userId: playlist.userId,
    name: playlist.name,
    isVertical: playlist.isVertical,
    code: playlist.code,
    isTimeFixed: playlist.isTimeFixed,
    isTemplateFixed: playlist.isTemplateFixed,
    items: playlist.items.map(item => ({
      id: item.id,
      type: item.type,
      media: item.data.id ?? 0,
      priceTable: item.data.id ?? 0,
      template: item.template?.id,
      order: item.order,
      seconds: item.seconds,
      playlist: playlist.id!,
    })),
  };
}
export const {
  useCreatePlaylistMutation,
  useFindAllPlaylistsQuery,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useFindByCodeQuery,
} = playlistApi;


function buildPlaylist(data: PlaylistDTO[], state: RootState): Playlist[] {
  const medias = state.media;
  const priceTables = state.priceTable;
  const templates = state.template;

  return data.map(playlistDTO => ({
    id: playlistDTO.id,
    userId: playlistDTO.userId,
    name: playlistDTO.name,
    isVertical: playlistDTO.isVertical,
    code: playlistDTO.code,
    isTimeFixed: playlistDTO.isTimeFixed,
    isTemplateFixed: playlistDTO.isTemplateFixed,
    items: playlistDTO.items.map(dtoItem => {
      // Resolve o objeto data com base no tipo
      let data: Media | PriceTable | undefined;

      switch (dtoItem.type) {
        case 'image':
        case 'video':
          data = medias.find(m => m.id === dtoItem.media);
          break;
        case 'priceTable':
          data = priceTables.find(pt => pt.id === dtoItem.priceTable);
          break;
      }

      // Resolve o template se existir
      const template = dtoItem.template !== undefined
        ? templates.find(t => t.id === dtoItem.template)
        : undefined;

      return {
        id: dtoItem.id,
        type: dtoItem.type,
        data: data!,
        template: template,
        order: dtoItem.order,
        seconds: dtoItem.seconds
      };
    })
  }));
}

