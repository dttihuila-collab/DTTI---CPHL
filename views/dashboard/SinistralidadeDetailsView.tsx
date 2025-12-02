import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataRecord } from '../../types';
import { Input, Label } from '../../components/common/FormElements';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#ef4444', '#f97316', '#16a34a', '#3b82f6', '#8b5cf6', '#fde047'];

const countByKey = (records: DataRecord[], key: string): { name: string; value: number }[] => {
    const counts = records.reduce((acc, record) => {
        const value = record[key] as string;
        if (value) {
            acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

type SinistralidadeSubCategory = 'Acidentes' | 'Vítimas';

const SinistralidadeDetailsView: React.FC<{ records: DataRecord[] }> = React.memo(({ records }) => {
    const { theme } = useTheme();
    const [activeSubCategory, setActiveSubCategory] = useState<SinistralidadeSubCategory>('Acidentes');
    const [searchTerm, setSearchTerm] = useState('');

    const acidentesRecords = useMemo(() => records.filter(r => r.categoria === 'Acidentes'), [records]);
    const vitimasRecords = useMemo(() => records.filter(r => r.categoria === 'Vítimas'), [records]);

    const filteredRecords = useMemo(() => {
        const recordsToFilter = activeSubCategory === 'Acidentes' ? acidentesRecords : vitimasRecords;
        if (!searchTerm) return recordsToFilter;
        const lowercasedFilter = searchTerm.toLowerCase();
        return recordsToFilter.filter(r =>
            Object.values(r).some(val => String(val).toLowerCase().includes(lowercasedFilter))
        );
    }, [activeSubCategory, acidentesRecords, vitimasRecords, searchTerm]);

    const renderContent = () => {
        switch (activeSubCategory) {
            case 'Acidentes': {
                const chartData = countByKey(filteredRecords, 'tipoAcidente');
                return (
                    <fieldset className="border dark:border-gray-700 p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Análise de Acidentes</legend>
                        {filteredRecords.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum registo encontrado.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-center">
                                <div className="h-64">
                                    <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Acidentes por Tipo</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="40%" cy="50%" outerRadius={80} fill="#8884d8">
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} /> 
                                            <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value) => <span className="text-gray-800 dark:text-gray-300">{value}</span>}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Acidentes</h4>
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                <tr><th className="px-6 py-3 text-left">Data</th><th className="px-6 py-3 text-left">Município</th><th className="px-6 py-3 text-left">Tipo</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {filteredRecords.slice(0, 5).map(r => (
                                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600"><td className="px-6 py-4 whitespace-nowrap">{new Date(r.data).toLocaleDateString()}</td><td className="px-6 py-4 whitespace-nowrap">{r.municipio}</td><td className="px-6 py-4 whitespace-nowrap">{r.tipoAcidente}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </fieldset>
                );
            }
            case 'Vítimas': {
                const chartData = countByKey(filteredRecords, 'vitimaEstado');
                return (
                     <fieldset className="border dark:border-gray-700 p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Análise de Vítimas</legend>
                         {filteredRecords.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum registo encontrado.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-center">
                                <div className="h-64">
                                    <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Vítimas por Estado</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="40%" cy="50%" outerRadius={80} fill="#82ca9d">
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} /> 
                                            <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value) => <span className="text-gray-800 dark:text-gray-300">{value}</span>}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimas Vítimas</h4>
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                <tr><th className="px-6 py-3 text-left">Nome</th><th className="px-6 py-3 text-left">Idade</th><th className="px-6 py-3 text-left">Estado</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {filteredRecords.slice(0, 5).map(r => (
                                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600"><td className="px-6 py-4 whitespace-nowrap">{r.vitimaNome}</td><td className="px-6 py-4 whitespace-nowrap">{r.vitimaIdade}</td><td className="px-6 py-4 whitespace-nowrap">{r.vitimaEstado}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </fieldset>
                );
            }
            default: return null;
        }
    };
    
    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(['Acidentes', 'Vítimas'] as SinistralidadeSubCategory[]).map(cat => {
                    const isActive = activeSubCategory === cat;
                    const total = cat === 'Acidentes' ? acidentesRecords.length : vitimasRecords.length;
                    return (
                        <button key={cat} onClick={() => setActiveSubCategory(cat)} className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${isActive ? 'bg-custom-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>Total de {cat}</h4>
                            <p className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>{total}</p>
                        </button>
                    );
                })}
            </div>
             <div className="my-4">
                <Label htmlFor="sinistralidade-search">Pesquisar em {activeSubCategory}</Label>
                <Input id="sinistralidade-search" type="text" placeholder="Digite para pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {renderContent()}
        </div>
    );
});

export default SinistralidadeDetailsView;