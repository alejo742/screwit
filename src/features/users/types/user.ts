export interface User {
  // Basic user information
  id: string;
  name: string;
  email: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;

  // Optional fields
  profilePicture?: string;
  organization?: string;
}

export type providerType = 'google'; // we might add more providers in the future