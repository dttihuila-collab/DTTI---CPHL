import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { SecurityIcon, DocumentIcon, UsersIcon, TransportIcon } from '../../components/icons/Icon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4 border-l-4 border-custom-blue-500">
        <div className="p-3 bg-custom-blue-100 dark:bg-gray-700 rounded-full text-custom-blue-600 dark:text-custom-blue-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const DashboardSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>)}
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
    </div>
);


const SupervisorDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        ocorrencias: 0,
        autos: 0,
        efetivos: 0,
        transportes: 0,
    });
    const [chartData, setChartData] = useState<{ name: string; Registos: number }[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const { theme } = useTheme();
    const { refreshKey } = useDataRefresh();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [criminalidade, sinistralidade, enfrentamento, autos, logistica, transportes] = await Promise.all([
                    api.getRecords('criminalidade'),
                    api.getRecords('sinistralidade'),
                    api.getRecords('enfrentamento'),
                    api.getRecords('autosExpediente'),
                    api.getRecords('logistica'),
                    api.getRecords('transportes'),
                ]);

                const efetivo = logistica.filter(r => 'nip' in r);
                const material = logistica.filter(r => 'tipoMaterial' in r);
                
                const totalOcorrencias = criminalidade.length + sinistralidade.length + enfrentamento.length;
                
                setStats({
                    ocorrencias: totalOcorrencias,
                    autos: autos.length,
                    efetivos: efetivo.length,
                    transportes: transportes.length,
                });
                
                setChartData([
                    { name: 'Ocorrências', Registos: totalOcorrencias },
                    { name: 'Autos', Registos: autos.length },
                    { name: 'Logística', Registos: logistica.length },
                    { name: 'Transportes', Registos: transportes.length },
                ]);
                
                const allRecords = [
                    ...criminalidade.map(r => ({ ...r, type: 'Criminalidade' })),
                    ...sinistralidade.map(r => ({ ...r, type: 'Sinistralidade' })),
                    ...enfrentamento.map(r => ({ ...r, type: 'Enfrentamento' })),
                    ...autos.map(r => ({ ...r, type: 'Auto de Expediente' })),
                    ...efetivo.map(r => ({ ...r, type: 'Efetivo (Log.)' })),
                    ...material.map(r => ({ ...r, type: 'Material (Log.)' })),
                    ...transportes.map(r => ({ ...r, type: 'Transporte' })),
                ];

                const sorted = allRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecentActivity(sorted.slice(0, 10));

            } catch (error) {
                console.error("Failed to load supervisor dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Dashboard Geral do Supervisor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Ocorrências" value={stats.ocorrencias} icon={<SecurityIcon className="w-6 h-6" />} />
                <StatCard title="Total de Autos" value={stats.autos} icon={<DocumentIcon className="w-6 h-6" />} />
                <StatCard title="Total de Efetivos" value={stats.efetivos} icon={<UsersIcon className="w-6 h-6" />} />
                <StatCard title="Movimentos de Transporte" value={stats.transportes} icon={<TransportIcon className="w-6 h-6" />} />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Volume de Registos por Subsistema</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#e2e8f0'} />
                             <XAxis dataKey="name" stroke={theme === 'dark' ? '#a0aec0' : '#4a5568'} />
                             <YAxis stroke={theme === 'dark' ? '#a0aec0' : '#4a5568'} />
                             <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} />
                             <Legend />
                             <Bar dataKey="Registos" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Atividade Recente no Sistema</h3>
                     <div className="overflow-y-auto max-h-[280px]">
                         <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentActivity.map(record => (
                                <li key={record.id} className="py-3">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{`Novo registo em ${record.type}`}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{`Em ${new Date(record.createdAt).toLocaleString()}`}</p>
                                </li>
                            ))}
                         </ul>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorDashboard;