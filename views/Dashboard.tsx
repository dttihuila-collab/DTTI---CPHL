import React, { useState, useEffect, useMemo } from 'react';
import { DashboardCategory, ApiKey, Subsystem } from '../types';
import { CrimeIcon, SinistralidadeIcon, PoliceIcon, TransportIcon, LogisticsIcon, ChevronDownIcon, DocumentIcon, FolderIcon } from '../components/icons/Icon';
import { api } from '../services/api';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import CriminalidadeDetailsView from './dashboard/CriminalidadeDetailsView';
import SinistralidadeDetailsView from './dashboard/SinistralidadeDetailsView';
import EnfrentamentoDetailsView from './dashboard/ResultadosDetailsView';
import TransportesDetailsView from './dashboard/TransportesDetailsView';
import LogisticaDetailsView from './dashboard/LogisticaDetailsView';
import GenericDetailsTable from './dashboard/GenericDetailsTable';

const allCategories = [
    { name: 'Criminalidade', icon: <CrimeIcon /> },
    { name: 'Sinistralidade Rodoviária', icon: <SinistralidadeIcon /> },
    { name: 'Enfrentamento Policial', icon: <PoliceIcon /> },
    { name: 'Transportes', icon: <TransportIcon /> },
    { name: 'Logística', icon: <LogisticsIcon /> },
    { name: 'Autos de Expediente', icon: <DocumentIcon /> },
] as const;

const subsystemCategories: Record<Subsystem, DashboardCategory[]> = {
    'Ocorrências Policiais': ['Criminalidade', 'Sinistralidade Rodoviária', 'Enfrentamento Policial'],
    'Transportes': ['Transportes'],
    'Logística': ['Logística'],
    'Autos de Expedientes': ['Autos de Expediente'],
    'Administração do Sistema': [],
};

const categoryToApiKey = (category: DashboardCategory): ApiKey => {
    switch (category) {
        case 'Criminalidade': return 'criminalidade';
        case 'Sinistralidade Rodoviária': return 'sinistralidade';
        case 'Enfrentamento Policial': return 'enfrentamento';
        case 'Transportes': return 'transportes';
        case 'Logística': return 'logistica';
        case 'Autos de Expediente': return 'autosExpediente';
        default: return 'criminalidade';
    }
}

const DetailsSkeleton = React.memo(() => (
    <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
    </div>
));

const DashboardDetails: React.FC<{ category: DashboardCategory }> = React.memo(({ category }) => {
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { refreshKey } = useDataRefresh();

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const apiKey = categoryToApiKey(category);
                const data = await api.getRecords(apiKey);
                setRecords(data.reverse()); 
            } catch (error) {
                console.error("Failed to fetch details", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (category) {
            fetchDetails();
        }
    }, [category, refreshKey]);
    
    if (isLoading) {
        return <DetailsSkeleton />;
    }

    if (records.length === 0) {
        return <div className="text-center p-8 text-gray-600 dark:text-gray-400">Nenhum dado registado para esta categoria.</div>;
    }

    switch (category) {
        case 'Criminalidade':
            return <CriminalidadeDetailsView records={records} />;
        case 'Sinistralidade Rodoviária':
            return <SinistralidadeDetailsView records={records} />;
        case 'Enfrentamento Policial':
            return <EnfrentamentoDetailsView records={records} />;
        case 'Transportes':
            return <TransportesDetailsView records={records} />;
        case 'Logística':
            return <LogisticaDetailsView records={records} />;
        default:
            return <GenericDetailsTable records={records} title="Últimos Registos" />;
    }
});


interface DashboardProps {
    subsystem: Subsystem;
}

const Dashboard: React.FC<DashboardProps> = ({ subsystem }) => {
    const [expandedCategory, setExpandedCategory] = useState<DashboardCategory | null>(null);
    const [totals, setTotals] = useState<{[key in DashboardCategory]?: number}>({});
    const { refreshKey } = useDataRefresh();

    const categories = useMemo(() => {
        const relevantCategoryNames = subsystemCategories[subsystem];
        return allCategories.filter(cat => relevantCategoryNames.includes(cat.name as DashboardCategory));
    }, [subsystem]);
    
    useEffect(() => {
        const fetchTotals = async () => {
            const relevantCategoryNames = subsystemCategories[subsystem];
            const promises = relevantCategoryNames.map(catName => api.getRecords(categoryToApiKey(catName)));
            const results = await Promise.all(promises);

            const newTotals: {[key in DashboardCategory]?: number} = {};
            relevantCategoryNames.forEach((catName, index) => {
                newTotals[catName] = results[index].length;
            });
            
            setTotals(newTotals);
        };
        
        if (subsystem !== 'Administração do Sistema') {
            fetchTotals();
        }
    }, [refreshKey, subsystem]);

    const handleCardClick = (category: DashboardCategory) => {
        setExpandedCategory(prev => prev === category ? null : category);
    };

    const isAnyCategoryExpanded = expandedCategory !== null;

    const renderDetails = (category: DashboardCategory | null) => {
        if (!category) return null;
        return (
             <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fade-in-down">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{category} - Detalhes</h3>
                <DashboardDetails category={category} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dashboard do Subsistema</h2>
            </div>

            <div className={`grid gap-6 ${isAnyCategoryExpanded && categories.length > 1 ? `grid-cols-${categories.length}` : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
                {categories.map(({ name, icon }) => {
                    const categoryName = name as DashboardCategory;
                    const isSelected = expandedCategory === categoryName;
                    
                    if (isAnyCategoryExpanded) {
                        return (
                            <div
                                key={name}
                                onClick={() => handleCardClick(categoryName)}
                                className={`p-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${
                                    isSelected 
                                    ? 'border-custom-blue-500 bg-custom-blue-100 dark:bg-custom-blue-900/50' 
                                    : 'bg-white dark:bg-gray-800 border-transparent'
                                }`}
                            >
                                <div className="flex flex-col items-center justify-center space-y-1 h-full text-center">
                                    <div className={`p-2 rounded-full transition-colors ${
                                        isSelected 
                                        ? 'bg-white text-custom-blue-600 dark:bg-custom-blue-500 dark:text-white' 
                                        : 'bg-custom-blue-100 text-custom-blue-600 dark:bg-gray-700 dark:text-custom-blue-400'
                                    }`}>
                                        {React.cloneElement(icon, { className: 'w-5 h-5' })}
                                    </div>
                                    <p className={`text-xs font-medium transition-colors ${
                                        isSelected 
                                        ? 'text-custom-blue-800 dark:text-custom-blue-300' 
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}>{name}</p>
                                    <p className={`text-xl font-bold transition-colors ${
                                        isSelected
                                        ? 'text-custom-blue-900 dark:text-white'
                                        : 'text-gray-800 dark:text-gray-200'
                                    }`}>
                                        {(totals[categoryName] ?? 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={name}
                            onClick={() => handleCardClick(categoryName)}
                            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent flex flex-col justify-between h-full"
                        >
                           <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-custom-blue-100 dark:bg-gray-700 rounded-full text-custom-blue-600 dark:text-custom-blue-400">
                                        {React.cloneElement(icon, { className: 'w-6 h-6' })}
                                    </div>
                                    <p className="font-semibold text-gray-600 dark:text-gray-300">{name}</p>
                                </div>
                                <div className="text-gray-400 dark:text-gray-500">
                                    <ChevronDownIcon />
                                </div>
                            </div>
                             <div className="mt-4">
                                <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{(totals[categoryName] ?? 0).toLocaleString()}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total de registos</p>
                             </div>
                        </div>
                    );
                })}
            </div>

            {renderDetails(expandedCategory)}
        </div>
    );
};

export default React.memo(Dashboard);