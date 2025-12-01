import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm h-16">
      <div className="flex items-center">
         <h1 className="text-xl font-semibold text-gray-700">Sistema de Controle do CPHL</h1>
      </div>
      <div className="flex items-center">
        <div className="text-right">
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
