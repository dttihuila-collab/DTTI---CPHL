import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Subsystem, Role, ApiKey, DashboardCategory } from '../types';
import { SUBSYSTEMS } from '../constants';
import { SecurityIcon, TransportIcon, LogisticsIcon, DocumentIcon, UsersIcon, LogoutIcon, UserCircleIcon } from '../components/icons/Icon';
import { api } from '../services/api';

// Helper functions and constants
const categoryToApiKey = (category: DashboardCategory): ApiKey => {
    switch (category) {
        case 'Criminalidade': return 'criminalidade';
        case 'Sinistralidade Rodoviária': return 'sinistralidade';
        case 'Resultados Operacionais': return 'resultados';
        case 'Transportes': return 'transportes';
        case 'Logística': return 'logistica';
        case 'Autos de Expediente': return 'autosExpediente';
        case 'Processos': return 'processos';
        default: return 'criminalidade';
    }
}

const subsystemCategories: Record<Subsystem, DashboardCategory[]> = {
    'Ocorrências Policiais': ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais'],
    'Transportes': ['Transportes'],
    'Logística': ['Logística'],
    'Autos de Expedientes': ['Autos de Expediente', 'Processos'],
    'Administração do Sistema': [],
};


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

const SummarySkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);


const SubsystemSelection: React.FC<SubsystemSelectionProps> = ({ onSelectSubsystem }) => {
    const { user, logout } = useContext(AuthContext);
    const [summaryData, setSummaryData] = useState<Record<string, Record<string, number>>>({});
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);

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

    useEffect(() => {
        const fetchSummaries = async () => {
            if (!availableSubsystems.length) {
                setIsLoadingSummary(false);
                return;
            }
            
            setIsLoadingSummary(true);
            try {
                const summaries: Record<string, Record<string, number>> = {};
                
                const subsystemsToFetch = availableSubsystems.filter(s => s !== 'Administração do Sistema');

                const promises = subsystemsToFetch.map(async (subsystemName) => {
                    const categories = subsystemCategories[subsystemName];
                    const categoryData = await Promise.all(
                        categories.map(async (categoryName) => {
                            const apiKey = categoryToApiKey(categoryName);
                            const records = await api.getRecords(apiKey);
                            return { categoryName, count: records.length };
                        })
                    );
                    return { subsystemName, categoryData };
                });

                const results = await Promise.all(promises);

                results.forEach(result => {
                    summaries[result.subsystemName] = {};
                    result.categoryData.forEach(cat => {
                        summaries[result.subsystemName][cat.categoryName] = cat.count;
                    });
                });

                setSummaryData(summaries);
            } catch (error) {
                console.error("Failed to fetch summaries:", error);
            } finally {
                setIsLoadingSummary(false);
            }
        };

        fetchSummaries();
    }, [availableSubsystems]);

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

                <div className="mt-20 w-full mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Resumo Geral</h2>
                    {isLoadingSummary ? (
                        <SummarySkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(summaryData).map(([subsystemName, categories]) => (
                                <div key={subsystemName} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-custom-blue-500">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{subsystemName}</h3>
                                    <ul className="space-y-3">
                                        {Object.entries(categories).length > 0 ? (
                                            Object.entries(categories).map(([categoryName, count]) => (
                                                <li key={categoryName} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                                    <span>{categoryName}</span>
                                                    <span className="font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-gray-200">{count}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500 dark:text-gray-400">Nenhum dado a apresentar.</li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubsystemSelection;