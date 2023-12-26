export type PayloadJwt = {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  iat: number;
  exp: number;
};
