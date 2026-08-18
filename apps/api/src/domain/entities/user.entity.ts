export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
