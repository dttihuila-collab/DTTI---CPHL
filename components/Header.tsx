import React from 'react';
import { User, Subsystem } from '../types';
import ThemeToggle from './ThemeToggle';
import { HomeIcon } from './icons/Icon';

interface HeaderProps {
  user: User;
  subsystemName: Subsystem;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(({ user, subsystemName, onGoHome }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm h-16">
      <div className="flex items-center">
        <button 
          onClick={onGoHome} 
          className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-custom-blue-600 dark:hover:text-custom-blue-400 transition-colors duration-200 group"
          aria-label="Voltar à seleção de subsistemas"
        >
          <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-custom-blue-100 dark:group-hover:bg-custom-blue-900/50 transition-colors duration-200">
              <HomeIcon className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200 group-hover:text-custom-blue-600 dark:group-hover:text-custom-blue-400 transition-colors duration-200">{subsystemName}</h1>
        </button>
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