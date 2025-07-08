import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { TemplateDTO } from '../Model/TemplateModel';
import config from '../Util/config';
import { RootState } from '../store';
import { addTemplate, deleteTemplate, setTemplates, updateTemplate } from '../store/reducers/template';
import { Media } from '../Model/MediaModel';

export interface CreateTemplateRequest {
  template: TemplateDTO;
}
export interface UpdateTemplateRequest {
  template: TemplateDTO;
}

const url = config.API.BASE_URL + config.API.ENDPOINTS.TEMPLATE

export const templateApi = createApi({
  reducerPath: 'templateApi',
  tagTypes: ['Template'],
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
    createTemplate: builder.mutation<TemplateDTO, CreateTemplateRequest>({
      query: (data) => ({
        url: 'create',
        method: 'POST',
        body: data.template,
      }),
      onQueryStarted: async (template, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addTemplate(data));
        } catch (error) {
          toast.error("Falha ao adicionar")
        }
      },
    }),

    findAllTemplates: builder.query<TemplateDTO[], string>({
      providesTags: ['Template'],
      query: (id) => ({
        url: `findall/${id}`,
        method: 'GET',
      }),
      onQueryStarted: async (template, { dispatch, queryFulfilled, getState}) => {
        try {
          const { data } = await queryFulfilled;
          const newTemplates = toModel(data, (getState() as RootState).media)
          dispatch(setTemplates(newTemplates))
        } catch (error) {
          toast.error("Falha ao buscar as templates preço")
        }
      },
    }),

    findAllDefaultTemplates: builder.query<TemplateDTO[], void>({
      providesTags: ['Template'],
      query: () => ({
        url: `findallDefault`,
        method: 'GET',
      }),
      onQueryStarted: async (template, { dispatch, queryFulfilled, getState}) => {
        try {
          const { data } = await queryFulfilled;
          const newTemplates = toModel(data, (getState() as RootState).media)
          newTemplates.forEach(t =>{
            dispatch(addTemplate(t))
          })      
        } catch (error) {
          toast.error("Falha ao buscar as templates preço")
        }
      },
    }),

    updateTemplate: builder.mutation<TemplateDTO, UpdateTemplateRequest>({
      invalidatesTags: ['Template'],
      query: (data) => ({
        url: 'update',
        method: 'PUT',
        body: data.template,
      }),
      onQueryStarted: async (template, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateTemplate({ ...data, grid: data.grid.split(",") }));
        } catch (error) {
          toast.error("Falha ao atualizar")
        }
      },
    }),

    // Endpoint para deletar Price Tables por IDs
    deleteTemplate: builder.mutation<boolean, number>({
      query: (data) => ({
        url: 'delete',
        method: 'DELETE',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      onQueryStarted: async (template, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(deleteTemplate(template));
        } catch (error) {
          toast.error("Falha ao deletar")
        }
      },
    }),
  }),
});

export const {
  useCreateTemplateMutation,
  useFindAllTemplatesQuery,
  useUpdateTemplateMutation,
  useFindAllDefaultTemplatesQuery,
  useDeleteTemplateMutation,
} = templateApi;

function toModel(data: TemplateDTO[], media: Media[]) {
  return data.map(template=>({
    ...template,
    image: media.find(m => m.id === template.image),
    background: media.find(m => m.id === template.background),
    grid: template.grid.split(','),
  }))
}

