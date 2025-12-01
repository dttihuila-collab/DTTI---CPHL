
import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { Role, View, User } from '../types';
import { APP_VIEWS } from '../constants';
import { DashboardIcon, CrimeIcon, RoadIcon, PoliceIcon, TransportIcon, LogisticsIcon, UsersIcon, ReportsIcon, LogoutIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icon';

interface SidebarProps {
  user: User;
  isCollapsed: boolean;
  setCurrentView: (view: View) => void;
  currentView: View;
  onToggleSidebar: () => void;
}

const iconMap: { [key in View]?: React.ReactElement } = {
    'Dashboard': <DashboardIcon />,
    'Criminalidade': <CrimeIcon />,
    'Sinistralidade Rodoviária': <RoadIcon />,
    'Resultados Policiais': <PoliceIcon />,
    'Transportes': <TransportIcon />,
    'Logística': <LogisticsIcon />,
    'Gerir Usuários': <UsersIcon />,
    'Relatórios': <ReportsIcon />,
};

const Sidebar: React.FC<SidebarProps> = ({ user, isCollapsed, setCurrentView, currentView, onToggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  const navItems = APP_VIEWS.filter(item => {
    if (!item.roles.includes(user.role)) {
      return false;
    }
    
    if (user.role === Role.Padrao) {
        if (item.name === 'Relatórios') {
            const formViews: View[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];
            return user.permissions?.some(p => formViews.includes(p)) ?? false;
        }
        return user.permissions?.includes(item.name) ?? false;
    }

    return true;
  });

  const baseButtonClass = "flex items-center w-full text-left p-3 rounded-lg transition-colors";
  const textClass = isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-4';
  const transitionClass = "transition-all duration-300 ease-in-out";

  return (
    <div className={`bg-white text-gray-700 flex flex-col transition-all duration-300 ease-in-out shadow-lg ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center p-4 h-16 border-b ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <h1 className={`text-2xl font-bold text-custom-blue-700 whitespace-nowrap overflow-hidden ${transitionClass} ${isCollapsed ? 'w-0' : 'w-auto'}`}>SCCPHL</h1>
        <button onClick={onToggleSidebar} className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none">
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setCurrentView(item.name)}
            className={`${baseButtonClass} ${isCollapsed ? 'justify-center' : ''} ${currentView === item.name ? 'bg-custom-blue-100 text-custom-blue-700' : 'hover:bg-custom-blue-50 hover:text-custom-blue-600'}`}
          >
            {iconMap[item.name]}
            <span className={`${textClass} ${transitionClass}`}>{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t">
        <button
          onClick={logout}
          className={`${baseButtonClass} ${isCollapsed ? 'justify-center' : ''} bg-red-50 hover:bg-red-100 text-red-600`}
        >
          <LogoutIcon />
          <span className={`${textClass} ${transitionClass}`}>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;