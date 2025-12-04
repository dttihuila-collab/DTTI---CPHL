import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DataRecord, CriminalidadeRecord } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#8b5cf6', '#fde047'];

const countByKey = (records: DataRecord[], key: keyof CriminalidadeRecord): { name: string; value: number }[] => {
    const counts = records.reduce((acc, record) => {
        const value = record[key] as string;
        if (value) {
            acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

const CriminalidadeDetailsView: React.FC<{ records: CriminalidadeRecord[] }> = React.memo(({ records }) => {
    const { theme } = useTheme();

    const chartDataByFamily = useMemo(() => countByKey(records, 'familiaCriminal'), [records]);
    const chartDataByMunicipality = useMemo(() => countByKey(records, 'municipio'), [records]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-80">
                    <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Crimes por Família</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartDataByFamily} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                if (percent < 0.05) return null;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">{(percent * 100).toFixed(0)}%</text>;
                            }}>
                                {chartDataByFamily.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="h-80">
                    <h4 className="text-md font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">Crimes por Município</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataByMunicipality.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4a5568' : '#e2e8f0'} />
                            <XAxis type="number" stroke={theme === 'dark' ? '#a0aec0' : '#4a5568'} />
                            <YAxis type="category" dataKey="name" width={80} stroke={theme === 'dark' ? '#a0aec0' : '#4a5568'} />
                            <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}} contentStyle={{ backgroundColor: theme === 'dark' ? '#334155' : '#fff', border: 'none', borderRadius: '0.5rem' }} itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#000' }} />
                            <Bar dataKey="value" name="N.º de Crimes" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Registos</h4>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 text-left">Data</th>
                                <th className="px-6 py-3 text-left">Município</th>
                                <th className="px-6 py-3 text-left">Crime</th>
                                <th className="px-6 py-3 text-left">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {records.slice(0, 10).map(r => (
                                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(r.dataOcorrencia).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{r.municipio}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{r.crime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{r.estadoProcesso}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

export default CriminalidadeDetailsView;