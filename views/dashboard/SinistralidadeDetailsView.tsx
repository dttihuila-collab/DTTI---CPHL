
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SinistralidadeRecord } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const SinistralidadeDetailsView: React.FC<{ records: SinistralidadeRecord[] }> = React.memo(({ records }) => {
    const { theme } = useTheme();

    const totals = useMemo(() => {
        // FIX: Ensure all values are treated as numbers during the arithmetic operation to prevent type errors.
        return records.reduce((acc, r) => {
            acc.acidentes += 1;
            acc.vitimas += Number(r.numeroVitimas || 0);
            acc.mortos += Number(r.numeroMortos || 0);
            acc.feridosGraves += Number(r.numeroFeridosGraves || 0);
            acc.feridosLigeiros += Number(r.numeroFeridosLigeiros || 0);
            return acc;
        }, { acidentes: 0, vitimas: 0, mortos: 0, feridosGraves: 0, feridosLigeiros: 0 });
    }, [records]);

    const chartDataByCausa = useMemo(() => {
        const counts = records.reduce((acc, record) => {
            const value = record.causaPresumivel;
            if (value) acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        // FIX: Explicitly cast values to Number during sort to prevent type errors if data is inconsistent.
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => Number(b.value) - Number(a.value));
    }, [records]);


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400">Acidentes</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totals.acidentes}</p></div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400">Vítimas</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totals.vitimas}</p></div>
                <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-lg"><p className="text-sm text-red-600 dark:text-red-300">Mortos</p><p className="text-2xl font-bold text-red-800 dark:text-red-100">{totals.mortos}</p></div>
                <div className="p-4 bg-orange-100 dark:bg-orange-900/50 rounded-lg"><p className="text-sm text-orange-600 dark:text-orange-300">Feridos Graves</p><p className="text-2xl font-bold text-orange-800 dark:text-orange-100">{totals.feridosGraves}</p></div>
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg"><p className="text-sm text-yellow-600 dark:text-yellow-300">Feridos Ligeiros</p><p className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">{totals.feridosLigeiros}</p></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                <div className="h-80">
                    <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Principais Causas de Acidentes</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataByCausa.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#e2e8f0'} />
                            <XAxis type="number" stroke={theme === 'dark' ? '#a0aec0' : '#4a5568'} />
                            <YAxis type="category" dataKey="name" width={120} stroke={theme === 'dark' ? '#a0aec0' : '#4a5568'} />
                            <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} />
                            <Bar dataKey="value" name="N.º de Acidentes" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Acidentes Graves</h4>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3 text-left">Data</th>
                                    <th className="px-6 py-3 text-left">Município</th>
                                    <th className="px-6 py-3 text-left">Tipo</th>
                                    <th className="px-6 py-3 text-left">Mortos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                {records.filter(r => r.numeroMortos > 0 || r.numeroFeridosGraves > 0).slice(0, 5).map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(r.dataAcidente).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.municipio}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.tipoAcidente}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">{r.numeroMortos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SinistralidadeDetailsView;
