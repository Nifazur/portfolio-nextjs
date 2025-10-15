export interface User {
  id: number
  name: string
  email: string
  bio?: string
  phone?: string
  picture?: string
  role: 'OWNER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
}

export interface UpdateProfileInput {
  name?: string
  bio?: string
  phone?: string
  picture?: string
}