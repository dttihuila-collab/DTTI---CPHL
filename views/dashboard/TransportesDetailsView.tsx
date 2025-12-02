import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataRecord } from '../../types';
import { Input, Label } from '../../components/common/FormElements';

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#8b5cf6', '#fde047'];

type TransportesSubCategory = 'Combustível' | 'Pessoal' | 'Manutenções';

const TransportesDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
    const [activeSubCategory, setActiveSubCategory] = useState<TransportesSubCategory>('Combustível');
    const [searchTerm, setSearchTerm] = useState('');

    const combustivelRecords = useMemo(() => records.filter(r => r.categoria === 'Municípios'), [records]);
    const pessoalRecords = useMemo(() => records.filter(r => r.categoria === 'Membros'), [records]);
    const manutencoesRecords = useMemo(() => records.filter(r => r.categoria === 'Manutenções'), [records]);

    const recordsByCategory = {
        'Combustível': combustivelRecords,
        'Pessoal': pessoalRecords,
        'Manutenções': manutencoesRecords
    };
    
    const filteredRecords = useMemo(() => {
        const recordsToFilter = recordsByCategory[activeSubCategory] || [];
        if (!searchTerm) return recordsToFilter;
        const lowercasedFilter = searchTerm.toLowerCase();
        return recordsToFilter.filter(r =>
            Object.values(r).some(val => String(val).toLowerCase().includes(lowercasedFilter))
        );
    }, [activeSubCategory, recordsByCategory, searchTerm]);

    const renderContent = () => {
        const currentRecords = filteredRecords;
        
        const renderTable = () => (
             <div className="overflow-x-auto mt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Últimos Registos</h4>
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>{Object.keys(currentRecords[0]).filter(k => !['id', 'createdAt', 'categoria', 'categoriaLogistica'].includes(k)).map(k => <th key={k} className="px-4 py-2">{k}</th>)}</tr>
                    </thead>
                    <tbody>
                        {currentRecords.slice(0, 5).map(r => (<tr key={r.id} className="border-b">{Object.entries(r).filter(([k]) => !['id', 'createdAt', 'categoria', 'categoriaLogistica'].includes(k)).map(([k, v]) => <td key={k} className="px-4 py-2">{String(v)}</td>)}</tr>))}
                    </tbody>
                </table>
            </div>
        );

        return (
            <fieldset className="border p-4 rounded-md animate-fade-in">
                 <legend className="text-lg font-medium text-gray-900 px-2">Análise de {activeSubCategory}</legend>
                 {currentRecords.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhum registo encontrado.</p> : (
                    <>
                    {activeSubCategory === 'Combustível' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-center">
                            <div className="h-64"><h4 className="text-md font-semibold text-center text-gray-700 mb-2">Distribuição por Município</h4><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={Object.entries(currentRecords.reduce((acc, r) => ({...acc, [r.municipio]: (acc[r.municipio] || 0) + Number(r.quantidadeRecebida)}), {} as Record<string, number>)).map(([name, value]) => ({name, value}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">{Object.keys(currentRecords).map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value) => `${value} L`} /><Legend /></PieChart></ResponsiveContainer></div>
                            {renderTable()}
                        </div>
                    )}
                    {(activeSubCategory === 'Pessoal' || activeSubCategory === 'Manutenções') && renderTable()}
                    </>
                 )}
            </fieldset>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['Combustível', 'Pessoal', 'Manutenções'] as TransportesSubCategory[]).map(cat => {
                    const isActive = activeSubCategory === cat;
                    const total = recordsByCategory[cat].length;
                    return (
                        <button key={cat} onClick={() => setActiveSubCategory(cat)} className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${isActive ? 'bg-custom-blue-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}>
                            <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>{cat}</h4>
                            <p className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>{total}</p>
                        </button>
                    );
                })}
            </div>
             <div className="my-4">
                <Label htmlFor="transportes-search">Pesquisar em {activeSubCategory}</Label>
                <Input id="transportes-search" type="text" placeholder="Digite para pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {renderContent()}
        </div>
    );
};

export default TransportesDetailsView;
