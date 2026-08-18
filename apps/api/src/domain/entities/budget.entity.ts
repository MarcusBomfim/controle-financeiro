export interface Budget {
  id: string;
  ownerId: string;
  categoryId: string;
  year: number;
  month: number;
  limitInCents: number;
  createdAt: Date;
  updatedAt: Date;
}
