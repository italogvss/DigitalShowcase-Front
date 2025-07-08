import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify'
import { UserDTO, User, UserAuth } from '../Model/UserModel'
import config from '../Util/config'
import { setCredentials } from '../store/reducers/auth'
import { addUser } from '../store/reducers/user'

export interface UserResponse {
  user: UserAuth
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}
const url = config.API.BASE_URL + config.API.ENDPOINTS.AUTH
export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: url,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserAuth, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (user, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled; // Dados retornados da mutação
          dispatch(setCredentials({ user: data, token: data.token })); // Adiciona o novo Price Table à lista no Redux
          toast.success("Olá, bem vindo(a)!")
        } catch (e) {      
           if (e && typeof e === 'object' && 'error' in e ) {
            toast.error(`Erro ${(e as any).error.originalStatus || 404}: ${(e as any).error.data || 'Verifique suas credenciais e tente novamente'}`);
          } else {
            toast.error("Ocorreu um erro desconhecido. Tente novamente mais tarde.");
          }
        }
      },
    }),
    register: builder.mutation<User, UserDTO>({
      query: (user) => ({
        url: 'register',
        method: 'POST',
        body: user,
      }),
      onQueryStarted: async (user, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled; // Dados retornados da mutação
          dispatch(addUser(data)); // Adiciona o novo Price Table à lista no Redux
        } catch (e) {
          if (e && typeof e === 'object' && 'error' in e) {
            const { status, data } = (e as any).error;
            // Verificando se o status é 409 (Conflito)
            if (status === 409) {
              // Aqui você pode verificar se tem algum dado específico em `data` para fornecer uma mensagem personalizada
              toast.error("Nome de Usuario já existe");
            } else if (status === 400) {
              toast.error("Erro de requisição. Dados inválidos.");
            } else if (status === 500) {
              toast.error("Erro interno no servidor.");
            } else {
              toast.error("Ocorreu um erro inesperado.");
            }

          }
        }
      }
    })
  }),
})

export const { useLoginMutation, useRegisterMutation } = authApi
