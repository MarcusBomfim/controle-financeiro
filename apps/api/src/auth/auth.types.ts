export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser;
  sessionToken: string;
}
