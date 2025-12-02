import React from 'react';
import { User } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = React.memo(({ user }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm h-16">
      <div className="flex items-center">
         <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Sistema de Controlo do CPHL</h1>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="text-right">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
        </div>
      </div>
    </header>
  );
});

export default Header;