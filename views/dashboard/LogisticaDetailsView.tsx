import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataRecord } from '../../types';
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

type LogisticaSubCategory = 'Armamento' | 'Viveres' | 'Vestuario';

const LogisticaDetailsView: React.FC<{ records: DataRecord[] }> = React.memo(({ records }) => {
    const { theme } = useTheme();
    const [activeSubCategory, setActiveSubCategory] = useState<LogisticaSubCategory>('Armamento');
    const [searchTerm, setSearchTerm] = useState('');

    const armamentoRecords = useMemo(() => records.filter(r => r.categoriaLogistica === 'Armamento'), [records]);
    const viveresRecords = useMemo(() => records.filter(r => r.categoriaLogistica === 'Viveres'), [records]);
    const vestuarioRecords = useMemo(() => records.filter(r => r.categoriaLogistica === 'Vestuario'), [records]);

    const filteredArmamento = useMemo(() => {
        if (!searchTerm) return armamentoRecords;
        const lowercasedFilter = searchTerm.toLowerCase();
        return armamentoRecords.filter(r =>
            r.agenteNome?.toLowerCase().includes(lowercasedFilter) ||
            r.tipoArmamento?.toLowerCase().includes(lowercasedFilter) ||
            r.numSerieArma?.toLowerCase().includes(lowercasedFilter)
        );
    }, [armamentoRecords, searchTerm]);

    const filteredViveres = useMemo(() => {
        if (!searchTerm) return viveresRecords;
        const lowercasedFilter = searchTerm.toLowerCase();
        return viveresRecords.filter(r =>
            r.descViveres?.toLowerCase().includes(lowercasedFilter) ||
            r.agenteNome?.toLowerCase().includes(lowercasedFilter)
        );
    }, [viveresRecords, searchTerm]);

    const filteredVestuario = useMemo(() => {
        if (!searchTerm) return vestuarioRecords;
        const lowercasedFilter = searchTerm.toLowerCase();
        return vestuarioRecords.filter(r =>
            r.tipoVestuario?.toLowerCase().includes(lowercasedFilter) ||
            r.agenteNome?.toLowerCase().includes(lowercasedFilter)
        );
    }, [vestuarioRecords, searchTerm]);
    
    const armamentoByType = countByKey(filteredArmamento, 'tipoArmamento');

    const renderContent = () => {
        switch (activeSubCategory) {
            case 'Armamento':
                return (
                    <fieldset className="border dark:border-gray-700 p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Análise de Armamento</legend>
                        {filteredArmamento.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum registo encontrado.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                <div className="h-64 md:col-span-1">
                                    <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Distribuição por Tipo</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={armamentoByType} dataKey="value" nameKey="name" cx="40%" cy="50%" outerRadius={80} fill="#8884d8">
                                                {armamentoByType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} />
                                            <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value) => <span className="text-gray-800 dark:text-gray-300">{value}</span>}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Registos de Armamento</h4>
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">Agente</th>
                                                    <th className="px-6 py-3 text-left">Tipo</th>
                                                    <th className="px-6 py-3 text-left">N/S</th>
                                                    <th className="px-6 py-3 text-left">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                {filteredArmamento.slice(0, 5).map(r => (
                                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-6 py-4 whitespace-nowrap">{r.agenteNome}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{r.tipoArmamento}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{r.numSerieArma}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{r.estadoArma}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </fieldset>
                );
            case 'Viveres':
                return (
                    <fieldset className="border dark:border-gray-700 p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Controlo de Viveres</legend>
                        {filteredViveres.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum registo encontrado.</p> : (
                            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Descrição</th>
                                            <th className="px-6 py-3 text-left">Quantidade</th>
                                            <th className="px-6 py-3 text-left">Validade</th>
                                            <th className="px-6 py-3 text-left">Unidade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                        {filteredViveres.map(r => (
                                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 whitespace-nowrap">{r.descViveres}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{r.qtdViveres}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{r.validadeViveres}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{r.unidadeViveres}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </fieldset>
                );
            case 'Vestuario':
                return (
                    <fieldset className="border dark:border-gray-700 p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Controlo de Vestuário</legend>
                        {filteredVestuario.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum registo encontrado.</p> : (
                            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Tipo</th>
                                            <th className="px-6 py-3 text-left">Estado</th>
                                            <th className="px-6 py-3 text-left">Tamanho</th>
                                            <th className="px-6 py-3 text-left">Quantidade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                        {filteredVestuario.map(r => (
                                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 whitespace-nowrap">{r.tipoVestuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{r.estadoVestuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{r.tamanhoVestuario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{r.qtdVestuario}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </fieldset>
                );
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['Armamento', 'Viveres', 'Vestuario'] as LogisticaSubCategory[]).map(cat => {
                    const isActive = activeSubCategory === cat;
                    const total = cat === 'Armamento' ? armamentoRecords.length : cat === 'Viveres' ? viveresRecords.length : vestuarioRecords.length;
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
                <Label htmlFor="logistica-search">Pesquisar por Nome ou Item</Label>
                <Input
                    id="logistica-search"
                    type="text"
                    placeholder="Digite para pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {renderContent()}
        </div>
    );
});

export default LogisticaDetailsView;