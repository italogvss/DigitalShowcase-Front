
export type UserDTO = {
  id?: number,
  cpf?: string,
  telephone?: string,
  email?: string,
  city?: string,
  state?: string,
  address?: string,
  name: string
  username: string,
  password: string
  isActive: boolean
  validUntil?: string
  role: string
  ownerId?: number
}

export type User = {
  id?: number,
  cpf?: string,
  telephone?: string,
  email?: string,
  city?: string,
  state?: string,
  address?: string,
  name: string
  username: string,
  password: string
  isActive: boolean
  validUntil?: string
  role: string
  owner: User | null
}

export type UserAuth = {
  id: number,
  name: string,
  role: string,
  maxTables: number,
  token: string
}
