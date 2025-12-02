
import React, { useState, useEffect } from 'react';
import { DashboardCategory, ApiKey } from '../types';
import { CrimeIcon, RoadIcon, PoliceIcon, TransportIcon, LogisticsIcon, ChevronDownIcon } from '../components/icons/Icon';
import { api } from '../services/api';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import CriminalidadeDetailsView from './dashboard/CriminalidadeDetailsView';
import SinistralidadeDetailsView from './dashboard/SinistralidadeDetailsView';
import ResultadosDetailsView from './dashboard/ResultadosDetailsView';
import TransportesDetailsView from './dashboard/TransportesDetailsView';
import LogisticaDetailsView from './dashboard/LogisticaDetailsView';
import GenericDetailsTable from './dashboard/GenericDetailsTable';

const categories: { name: DashboardCategory, icon: React.ReactElement }[] = [
    { name: 'Criminalidade', icon: <CrimeIcon /> },
    { name: 'Sinistralidade Rodoviária', icon: <RoadIcon /> },
    { name: 'Resultados Policiais', icon: <PoliceIcon /> },
    { name: 'Transportes', icon: <TransportIcon /> },
    { name: 'Logística', icon: <LogisticsIcon /> },
];

const timeFilters = ['Dia', 'Semana', 'Mês', 'Ano'];

const categoryToApiKey = (category: DashboardCategory): ApiKey => {
    switch (category) {
        case 'Criminalidade': return 'criminalidade';
        case 'Sinistralidade Rodoviária': return 'sinistralidade';
        case 'Resultados Policiais': return 'resultados';
        case 'Transportes': return 'transportes';
        case 'Logística': return 'logistica';
        default: return 'criminalidade';
    }
}

const DashboardDetails: React.FC<{ category: DashboardCategory }> = ({ category }) => {
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
        return <div className="text-center p-8 text-gray-600">A carregar detalhes...</div>;
    }

    if (records.length === 0) {
        return <div className="text-center p-8 text-gray-600">Nenhum dado registado para esta categoria.</div>;
    }

    switch (category) {
        case 'Criminalidade':
            return <CriminalidadeDetailsView records={records} />;
        case 'Sinistralidade Rodoviária':
            return <SinistralidadeDetailsView records={records} />;
        case 'Resultados Policiais':
            return <ResultadosDetailsView records={records} />;
        case 'Transportes':
            return <TransportesDetailsView records={records} />;
        case 'Logística':
            return <LogisticaDetailsView records={records} />;
        default:
            return <GenericDetailsTable records={records} title="Últimos Registos" />;
    }
};


const Dashboard: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('Mês');
    const [expandedCategory, setExpandedCategory] = useState<DashboardCategory | null>(null);
    const [totals, setTotals] = useState<{[key in DashboardCategory]: number}>({
        'Criminalidade': 0,
        'Sinistralidade Rodoviária': 0,
        'Resultados Policiais': 0,
        'Transportes': 0,
        'Logística': 0
    });
    const { refreshKey } = useDataRefresh();
    
    useEffect(() => {
        const fetchTotals = async () => {
            const [criminalidadeCount, sinistralidadeCount, resultadosCount, transportesCount, logisticaCount] = await Promise.all([
                api.getRecords('criminalidade').then(r => r.length),
                api.getRecords('sinistralidade').then(r => r.length),
                api.getRecords('resultados').then(r => r.length),
                api.getRecords('transportes').then(r => r.length),
                api.getRecords('logistica').then(r => r.length)
            ]);

            setTotals({
                'Criminalidade': criminalidadeCount,
                'Sinistralidade Rodoviária': sinistralidadeCount,
                'Resultados Policiais': resultadosCount,
                'Transportes': transportesCount,
                'Logística': logisticaCount,
            });
        };
        
        fetchTotals();
    }, [refreshKey]);

    const handleCardClick = (category: DashboardCategory) => {
        setExpandedCategory(prev => prev === category ? null : category);
    };

    const isAnyCategoryExpanded = expandedCategory !== null;

    const renderDetails = (category: DashboardCategory | null) => {
        if (!category) return null;
        return (
             <div className="mt-6 bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{category} - Detalhes</h3>
                <DashboardDetails category={category} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
                <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm">
                    {timeFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeFilter === filter ? 'bg-custom-blue-600 text-white shadow' : 'text-gray-600 hover:bg-custom-blue-50'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid gap-6 ${isAnyCategoryExpanded && categories.length > 1 ? `grid-cols-${categories.length}` : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}`}>
                {categories.map(({ name, icon }) => {
                    const isSelected = expandedCategory === name;
                    
                    if (isAnyCategoryExpanded) {
                        return (
                            <div
                                key={name}
                                onClick={() => handleCardClick(name)}
                                className={`p-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${
                                    isSelected 
                                    ? 'border-custom-blue-500 bg-custom-blue-100' 
                                    : 'bg-white border-transparent'
                                }`}
                            >
                                <div className="flex flex-col items-center justify-center space-y-1 h-full text-center">
                                    <div className={`p-2 rounded-full transition-colors ${
                                        isSelected 
                                        ? 'bg-white text-custom-blue-600' 
                                        : 'bg-custom-blue-100 text-custom-blue-600'
                                    }`}>
                                        {React.cloneElement(icon, { className: 'w-5 h-5' })}
                                    </div>
                                    <p className={`text-xs font-medium transition-colors ${
                                        isSelected 
                                        ? 'text-custom-blue-800' 
                                        : 'text-gray-600'
                                    }`}>{name}</p>
                                    <p className={`text-xl font-bold transition-colors ${
                                        isSelected
                                        ? 'text-custom-blue-900'
                                        : 'text-gray-800'
                                    }`}>
                                        {totals[name].toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={name}
                            onClick={() => handleCardClick(name)}
                            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent flex flex-col justify-between h-full"
                        >
                           <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-custom-blue-100 rounded-full text-custom-blue-600">
                                        {React.cloneElement(icon, { className: 'w-6 h-6' })}
                                    </div>
                                    <p className="font-semibold text-gray-600">{name}</p>
                                </div>
                                <div className="text-gray-400">
                                    <ChevronDownIcon />
                                </div>
                            </div>
                             <div className="mt-4">
                                <p className="text-4xl font-bold text-gray-800">{totals[name].toLocaleString()}</p>
                             </div>
                        </div>
                    );
                })}
            </div>

            {renderDetails(expandedCategory)}
        </div>
    );
};

export default Dashboard;
