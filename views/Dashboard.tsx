
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardCategory } from '../types';
import { CrimeIcon, RoadIcon, PoliceIcon, TransportIcon, LogisticsIcon, ChevronDownIcon } from '../components/icons/Icon';
import { api } from '../services/api';

const categories: { name: DashboardCategory, icon: React.ReactElement }[] = [
    { name: 'Criminalidade', icon: <CrimeIcon /> },
    { name: 'Sinistralidade Rodoviária', icon: <RoadIcon /> },
    { name: 'Resultados Policiais', icon: <PoliceIcon /> },
    { name: 'Transportes', icon: <TransportIcon /> },
    { name: 'Logística', icon: <LogisticsIcon /> },
];

const timeFilters = ['Dia', 'Semana', 'Mês', 'Ano'];

const chartData = [
  { name: 'Seg', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Ter', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Qua', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Qui', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Sex', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Sáb', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Dom', uv: 3490, pv: 4300, amt: 2100 },
];

const pieChartData = [
  { name: 'Grupo A', value: 400 },
  { name: 'Grupo B', value: 300 },
  { name: 'Grupo C', value: 300 },
  { name: 'Grupo D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    
    useEffect(() => {
        const fetchTotals = async () => {
            const criminalidadeCount = (await api.getRecords('criminalidade')).length;
            const sinistralidadeCount = (await api.getRecords('sinistralidade')).length;
            const resultadosCount = (await api.getRecords('resultados')).length;
            const transportesCount = (await api.getRecords('transportes')).length;
            const logisticaCount = (await api.getRecords('logistica')).length;

            setTotals({
                'Criminalidade': criminalidadeCount,
                'Sinistralidade Rodoviária': sinistralidadeCount,
                'Resultados Policiais': resultadosCount,
                'Transportes': transportesCount,
                'Logística': logisticaCount,
            });
        };
        
        fetchTotals();
    }, []);

    const handleCardClick = (category: DashboardCategory) => {
        setExpandedCategory(prev => prev === category ? null : category);
    };

    const isAnyCategoryExpanded = expandedCategory !== null;

    const renderDetails = (category: DashboardCategory | null) => {
        if (!category) return null;

        return (
             <div className="mt-6 bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{category} - Detalhes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pv" fill="#8884d8" />
                                <Bar dataKey="uv" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <div className="lg:col-span-3 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
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