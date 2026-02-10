export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Entry = {
  id: number;
  userId: number;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};
