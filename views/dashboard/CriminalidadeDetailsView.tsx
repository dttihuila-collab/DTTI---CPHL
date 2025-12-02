import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataRecord, CrimeFamily } from '../../types';
import { Input, Label } from '../../components/common/FormElements';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#8b5cf6', '#fde047'];

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

type CrimeSubCategory = 'Crimes Contra o Património' | 'Crimes Contra Pessoa' | 'Outros';

const CriminalidadeDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
    const { theme } = useTheme();
    const [activeSubCategory, setActiveSubCategory] = useState<CrimeSubCategory>('Crimes Contra o Património');
    const [searchTerm, setSearchTerm] = useState('');

    const recordsByFamily = useMemo(() => {
        const families: Record<string, DataRecord[]> = {
            'Crimes Contra Pessoa': [],
            'Crimes Contra o Património': [],
            'Outros': [],
        };
        records.forEach(r => {
            if (r.familiaDeletiva === 'Crimes Contra Pessoa') {
                families['Crimes Contra Pessoa'].push(r);
            } else if (r.familiaDeletiva === 'Crimes Contra o Património') {
                families['Crimes Contra o Património'].push(r);
            } else {
                families['Outros'].push(r);
            }
        });
        return families;
    }, [records]);

    const filteredRecords = useMemo(() => {
        const recordsToFilter = recordsByFamily[activeSubCategory] || [];
        if (!searchTerm) return recordsToFilter;
        const lowercasedFilter = searchTerm.toLowerCase();
        return recordsToFilter.filter(r =>
            Object.values(r).some(val => String(val).toLowerCase().includes(lowercasedFilter))
        );
    }, [recordsByFamily, activeSubCategory, searchTerm]);

    const chartData = useMemo(() => countByKey(filteredRecords, 'crime'), [filteredRecords]);

    const renderContent = () => {
        return (
            <fieldset className="border dark:border-gray-700 p-4 rounded-md animate-fade-in">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Análise de {activeSubCategory}</legend>
                {filteredRecords.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum registo encontrado.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="h-64 md:col-span-1">
                            <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Distribuição por Crime</h4>
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
                        <div className="md:col-span-2 overflow-x-auto">
                            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Registos</h4>
                            <table className="w-full text-sm dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                    <tr>
                                        <th className="px-4 py-2">Data</th>
                                        <th className="px-4 py-2">Município</th>
                                        <th className="px-4 py-2">Crime</th>
                                        <th className="px-4 py-2">Vítima</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.slice(0, 5).map(r => (
                                        <tr key={r.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-2">{new Date(r.data).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{r.municipio}</td>
                                            <td className="px-4 py-2">{r.crime}</td>
                                            <td className="px-4 py-2">{r.vitimaNome}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </fieldset>
        );
    }

    const subCategories: CrimeSubCategory[] = ['Crimes Contra o Património', 'Crimes Contra Pessoa', 'Outros'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subCategories.map(cat => {
                    const isActive = activeSubCategory === cat;
                    const total = (recordsByFamily[cat] || []).length;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveSubCategory(cat)}
                            className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${isActive ? 'bg-custom-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>{cat}</h4>
                            <p className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>{total}</p>
                        </button>
                    );
                })}
            </div>

            <div className="my-4">
                <Label htmlFor="criminalidade-search">Pesquisar em {activeSubCategory}</Label>
                <Input
                    id="criminalidade-search"
                    type="text"
                    placeholder="Digite para pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {renderContent()}
        </div>
    );
};

export default CriminalidadeDetailsView;