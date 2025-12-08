import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Role, View, User, DashboardCategory, Subsystem } from '../types';
import { SUBSYSTEMS, ALL_VIEWS } from '../constants';
import { DashboardIcon, CrimeIcon, SinistralidadeIcon, PoliceIcon, TransportIcon, LogisticsIcon, UsersIcon, ReportsIcon, LogoutIcon, ChevronLeftIcon, ChevronRightIcon, DatabaseIcon, DocumentIcon, FolderIcon, AddIcon } from './icons/Icon';

interface SidebarProps {
  user: User;
  subsystem: Subsystem;
  isCollapsed: boolean;
  setCurrentView: (view: View) => void;
  openActionMenu: (category: DashboardCategory) => void;
  currentView: View;
  onToggleSidebar: () => void;
}

const iconMap: { [key in View]?: React.ReactElement } = {
    'Dashboard': <DashboardIcon />,
    'Registar Ocorrência': <AddIcon />,
    'Consultar Ocorrências': <ReportsIcon />,
    'Criminalidade': <CrimeIcon />,
    'Sinistralidade Rodoviária': <SinistralidadeIcon />,
    'Enfrentamento Policial': <PoliceIcon />,
    'Transportes': <TransportIcon />,
    'Logística': <LogisticsIcon />,
    'Gerir Usuários': <UsersIcon />,
    'Relatórios': <ReportsIcon />,
    'Database Setup': <DatabaseIcon />,
    // Icons for Autos
    'Auto de Queixa': <DocumentIcon />,
    'Auto de Apreensão': <DocumentIcon />,
    'Auto de Notícia': <DocumentIcon />,
    'Aviso de Notificação': <DocumentIcon />,
    'Informação': <DocumentIcon />,
    'Participação': <DocumentIcon />,
    'Apresentação': <DocumentIcon />,
    'Processos': <FolderIcon />,
};

const formViews: View[] = ['Transportes', 'Logística'];


const Sidebar: React.FC<SidebarProps> = React.memo(({ user, subsystem, isCollapsed, setCurrentView, openActionMenu, currentView, onToggleSidebar }) => {
  const { logout } = useContext(AuthContext);

  const navItems = useMemo(() => {
    const subsystemConfig = SUBSYSTEMS[subsystem];
    if (!subsystemConfig) return [];
    
    return subsystemConfig.views.filter(viewName => {
        const viewConfig = ALL_VIEWS[viewName];
        if (!viewConfig || !viewConfig.roles.includes(user.role)) {
            return false;
        }
        return true;
    });
}, [user, subsystem]);


  const handleMenuClick = (viewName: View) => {
    if (formViews.includes(viewName)) {
        openActionMenu(viewName as DashboardCategory);
    } else {
        setCurrentView(viewName);
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
        {navItems.map(viewName => {
            const isActive = currentView === viewName;

            return (
                <div key={viewName}>
                    <button
                        onClick={() => handleMenuClick(viewName)}
                        className={`${baseButtonClass} ${isCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-custom-blue-100 text-custom-blue-700 dark:bg-custom-blue-900 dark:text-custom-blue-300' : 'hover:bg-custom-blue-50 hover:text-custom-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {iconMap[viewName]}
                        <span className={`${textClass} ${transitionClass} flex-1`}>{viewName === 'Gerir Usuários' ? 'Gerir Utilizadores' : viewName}</span>
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