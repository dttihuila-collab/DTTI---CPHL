import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Subsystem, Role } from '../types';
import { SUBSYSTEMS } from '../constants';
import { SecurityIcon, TransportIcon, LogisticsIcon, DocumentIcon, UsersIcon, LogoutIcon, UserCircleIcon } from '../components/icons/Icon';
import SupervisorDashboard from './dashboard/SupervisorDashboard';

interface SubsystemSelectionProps {
    onSelectSubsystem: (subsystem: Subsystem) => void;
}

const subsystemIcons: Record<Subsystem, React.ReactElement> = {
    'Ocorrências Policiais': <SecurityIcon className="w-16 h-16" />,
    'Transportes': <TransportIcon className="w-16 h-16" />,
    'Logística': <LogisticsIcon className="w-16 h-16" />,
    'Autos de Expedientes': <DocumentIcon className="w-16 h-16" />,
    'Administração do Sistema': <UsersIcon className="w-16 h-16" />,
};

const SubsystemSelection: React.FC<SubsystemSelectionProps> = ({ onSelectSubsystem }) => {
    const { user, logout } = useContext(AuthContext);

    const availableSubsystems = useMemo(() => {
        if (!user) return [];
        return (Object.keys(SUBSYSTEMS) as Subsystem[]).filter(subsystemName => {
            const subsystem = SUBSYSTEMS[subsystemName];
            
            if (user.role === Role.Admin || user.role === Role.Supervisor) {
                return subsystem.roles.includes(user.role);
            }
            
            if (user.role === Role.Padrao) {
                return user.permissions?.includes(subsystemName) ?? false;
            }

            return false;
        });
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 md:p-8 relative">
             <button
              onClick={logout}
              className="absolute top-6 right-6 flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg shadow-sm transition-colors duration-200"
              aria-label="Terminar sessão"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Sair</span>
            </button>
            <div className="w-full max-w-7xl mx-auto">
                <div className="text-center mb-12 mt-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 text-gray-500 dark:text-gray-400">
                        <UserCircleIcon className="w-20 h-20" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h1>
                    <div className="mt-2 text-md text-gray-500 dark:text-gray-400">
                        <p>{user.patente} • {user.funcao}</p>
                        <p className="mt-1">{user.orgaoUnidade}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {availableSubsystems.map(subsystem => (
                        <button
                            key={subsystem}
                            onClick={() => onSelectSubsystem(subsystem)}
                            className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center justify-center space-y-4 text-center border-b-4 border-transparent hover:border-custom-blue-500"
                        >
                            <div className="text-custom-blue-600 dark:text-custom-blue-400">
                                {subsystemIcons[subsystem]}
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{subsystem}</h2>
                        </button>
                    ))}
                </div>

                {user.role === Role.Supervisor && (
                    <div className="mt-20 w-full mb-8">
                        <SupervisorDashboard />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubsystemSelection;