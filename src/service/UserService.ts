import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { PasswordChangeRequest } from "../Model/PasswordChangeModal";
import { User, UserDTO } from "../Model/UserModel";
import { RootState } from '../store';
import { addUser, deleteUser, updateUser } from "../store/reducers/user";
import config from "../Util/config";

const url = config.API.BASE_URL + config.API.ENDPOINTS.USER;

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation<UserDTO, UserDTO>({
      query: (data) => ({
        url: "create",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (user, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
          const user = toModel(data, (getState() as RootState))
          dispatch(addUser(user))
          toast.success("Usuário criado com sucesso");
        } catch (error) {
          
          toast.error("Falha ao criar usuário");
        }
      },
    }),

    findAllByOwner: builder.query<UserDTO[], string>({
      providesTags: ["User"],
      query: (ownerId) => ({
        url: `findall/${ownerId}`,
        method: "GET",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          
          toast.error("Falha ao buscar usuários");
        }
      },
    }),

    updateUser: builder.mutation<UserDTO, UserDTO>({
      query: (data) => ({
        url: "update",
        method: "PUT",
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled, getState }) => {
        try {
          const { data } = await queryFulfilled;
          const user = toModel(data, (getState() as RootState))
          dispatch(updateUser(user))
        } catch (error) {
          
          toast.error("Falha ao atualizar usuário");
        }
      },
    }),

    updatePassword: builder.mutation<void, PasswordChangeRequest>({
      query: (data) => ({
        url: "updatePassword",
        method: "PUT",
        body: data,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          
          toast.error("Falha ao atualizar senha");
        }
      },
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `delete/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(deleteUser(id))
        } catch (error) {
          
          toast.error("Falha ao deletar usuário");
        }
      },
    }),
  }),
});

export const {
  useCreateUserMutation,
  useFindAllByOwnerQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useDeleteUserMutation,
} = userApi;


function toModel(data: UserDTO, state: RootState): User {
  const users = state.users; // Acessa o slice users
  const owner = users.find(user => user.id === data.ownerId) ?? null;

  return {
    ...data,
    owner,
  };
}



