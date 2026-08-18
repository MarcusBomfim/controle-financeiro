export interface AuthUser {
  id: string
  fullName: string
  email: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  fullName: string
}

export interface AuthResponse {
  user: AuthUser
}
