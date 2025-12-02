
import React from 'react';
import { User } from '../types';

export const AuthContext = React.createContext<{
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}>({
  user: null,
  login: async () => false,
  logout: () => {},
});
