/**
 * User Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
}
