import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Role, View, User, NavItem, DashboardCategory } from '../types';
import { APP_VIEWS } from '../constants';
import { DashboardIcon, CrimeIcon, RoadIcon, PoliceIcon, TransportIcon, LogisticsIcon, UsersIcon, ReportsIcon, LogoutIcon, ChevronLeftIcon, ChevronRightIcon, DatabaseIcon, DocumentIcon, FolderIcon } from './icons/Icon';

interface SidebarProps {
  user: User;
  isCollapsed: boolean;
  setCurrentView: (view: View) => void;
  openActionMenu: (category: DashboardCategory) => void;
  currentView: View;
  onToggleSidebar: () => void;
}

const iconMap: { [key in View]?: React.ReactElement } = {
    'Dashboard': <DashboardIcon />,
    'Criminalidade': <CrimeIcon />,
    'Sinistralidade Rodoviária': <RoadIcon />,
    'Resultados Operacionais': <PoliceIcon />,
    'Transportes': <TransportIcon />,
    'Logística': <LogisticsIcon />,
    'Autos de Expediente': <DocumentIcon />,
    'Processos': <FolderIcon />,
    'Gerir Usuários': <UsersIcon />,
    'Relatórios': <ReportsIcon />,
    'Database Setup': <DatabaseIcon />,
};

const formViews: View[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais', 'Transportes', 'Logística', 'Autos de Expediente', 'Processos'];


const Sidebar: React.FC<SidebarProps> = React.memo(({ user, isCollapsed, setCurrentView, openActionMenu, currentView, onToggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  const navItems = APP_VIEWS.filter(item => {
    if (!item.roles.includes(user.role)) {
      return false;
    }
    
    if (user.role === Role.Padrao) {
        if (item.name === 'Relatórios') {
            return user.permissions?.some(p => formViews.includes(p)) ?? false;
        }
        return user.permissions?.includes(item.name) ?? false;
    }

    return true;
  });

  const handleMenuClick = (item: NavItem) => {
    if (formViews.includes(item.name)) {
        openActionMenu(item.name as DashboardCategory);
    } else {
        setCurrentView(item.name);
    }
  };

  const baseButtonClass = "flex items-center w-full text-left p-3 rounded-lg transition-colors";
  const textClass = isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-4';
  const transitionClass = "transition-all duration-300 ease-in-out";

  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex flex-col transition-all duration-300 ease-in-out shadow-lg ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center p-4 h-16 border-b dark:border-gray-700 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <h1 className={`text-2xl font-bold text-custom-blue-700 dark:text-custom-blue-400 whitespace-nowrap overflow-hidden ${transitionClass} ${isCollapsed ? 'w-0' : 'w-auto'}`}>SCCPHL</h1>
        <button onClick={onToggleSidebar} className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map(item => {
            const isActive = currentView === item.name;

            return (
                <div key={item.name}>
                    <button
                        onClick={() => handleMenuClick(item)}
                        className={`${baseButtonClass} ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-custom-blue-100 text-custom-blue-700 dark:bg-custom-blue-900 dark:text-custom-blue-300' : 'hover:bg-custom-blue-50 hover:text-custom-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {iconMap[item.name]}
                        <span className={`${textClass} ${transitionClass} flex-1`}>{item.name === 'Gerir Usuários' ? 'Gerir Utilizadores' : item.name}</span>
                    </button>
                </div>
            )
        })}
      </nav>
      <div className="px-4 py-4 border-t dark:border-gray-700">
        <button
          onClick={logout}
          className={`${baseButtonClass} ${isCollapsed ? 'justify-center' : ''} bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400`}
        >
          <LogoutIcon />
          <span className={`${textClass} ${transitionClass}`}>Sair</span>
        </button>
      </div>
    </div>
  );
});

export default Sidebar;