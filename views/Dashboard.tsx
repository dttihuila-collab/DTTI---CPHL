import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DashboardCategory, DataRecord, ApiKey } from '../types';
import { CrimeIcon, RoadIcon, PoliceIcon, TransportIcon, LogisticsIcon, ChevronDownIcon } from '../components/icons/Icon';
import { api } from '../services/api';
import { Input, Label } from '../components/common/FormElements';

const categories: { name: DashboardCategory, icon: React.ReactElement }[] = [
    { name: 'Criminalidade', icon: <CrimeIcon /> },
    { name: 'Sinistralidade Rodoviária', icon: <RoadIcon /> },
    { name: 'Resultados Policiais', icon: <PoliceIcon /> },
    { name: 'Transportes', icon: <TransportIcon /> },
    { name: 'Logística', icon: <LogisticsIcon /> },
];

const timeFilters = ['Dia', 'Semana', 'Mês', 'Ano'];

const COLORS = ['#3b82f6', '#16a34a', '#f97316', '#ef4444', '#8b5cf6', '#fde047'];

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

const GenericDetailsTable: React.FC<{ records: DataRecord[], title?: string }> = ({ records, title }) => {
    const recentRecords = records.slice(0, 10);
    const headers = recentRecords.length > 0 ? Object.keys(recentRecords[0]) : [];

    return (
        <div className="overflow-x-auto">
            {title && <h4 className="text-lg font-semibold text-gray-700 mb-4">{title}</h4>}
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {headers.map(key => <th key={key} scope="col" className="px-6 py-3">{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {recentRecords.map(record => (
                        <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                            {headers.map(key => <td key={key} className="px-6 py-4 whitespace-nowrap">{String(record[key])}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CriminalidadeDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
    const crimesByFamily = countByKey(records, 'familiaDeletiva');
    const recentOccurrences = records.slice(0, 10);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                    <h4 className="text-md font-semibold text-center text-gray-700 mb-2">Crimes por Família Deletiva</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={crimesByFamily} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                {crimesByFamily.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-gray-100 p-4 rounded-lg flex flex-col justify-center text-center">
                    <h4 className="text-sm font-medium text-gray-600">Total de Ocorrências</h4>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{records.length}</p>
                </div>
            </div>
             <div className="overflow-x-auto">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Últimas Ocorrências</h4>
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Município</th>
                            <th scope="col" className="px-6 py-3">Crime</th>
                            <th scope="col" className="px-6 py-3">Vítima</th>
                             <th scope="col" className="px-6 py-3">Acusado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOccurrences.map(record => (
                            <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                               <td className="px-6 py-4">{new Date(record.data).toLocaleString()}</td>
                               <td className="px-6 py-4">{record.municipio}</td>
                               <td className="px-6 py-4">{record.crime}</td>
                               <td className="px-6 py-4">{record.vitimaNome}</td>
                               <td className="px-6 py-4">{record.acusadoNome}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SinistralidadeDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
    const accidentsByType = countByKey(records.filter(r => r.categoria === 'Acidentes'), 'tipoAcidente');
    const victimsByStatus = countByKey(records.filter(r => r.categoria === 'Vítimas'), 'vitimaEstado');
    const totalAccidents = records.filter(r => r.categoria === 'Acidentes').length;
    const totalVictims = records.filter(r => r.categoria === 'Vítimas').length;

    return (
         <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total de Acidentes</h4>
                    <p className="text-2xl font-bold text-gray-800">{totalAccidents}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total de Vítimas</h4>
                    <p className="text-2xl font-bold text-gray-800">{totalVictims}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accidentsByType.length > 0 && (
                    <div className="h-64">
                        <h4 className="text-md font-semibold text-center text-gray-700 mb-2">Acidentes por Tipo</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={accidentsByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                    {accidentsByType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
                 {victimsByStatus.length > 0 && (
                    <div className="h-64">
                        <h4 className="text-md font-semibold text-center text-gray-700 mb-2">Vítimas por Estado</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={victimsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d">
                                    {victimsByStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                 )}
            </div>
             {totalAccidents > 0 && <GenericDetailsTable records={records.filter(r => r.categoria === 'Acidentes')} title="Últimos Acidentes Registados" />}
        </div>
    );
};

const ResultadosDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
    const operacoes = records.filter(r => r.categoria === 'Operações');
    const patrulhamentos = records.filter(r => r.categoria === 'Patrulhamentos');
    const detidos = records.filter(r => r.categoria === 'Detidos');

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total de Operações</h4>
                    <p className="text-2xl font-bold text-gray-800">{operacoes.length}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total de Patrulhamentos</h4>
                    <p className="text-2xl font-bold text-gray-800">{patrulhamentos.length}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total de Detidos</h4>
                    <p className="text-2xl font-bold text-gray-800">{detidos.length}</p>
                </div>
            </div>
            
            {operacoes.length > 0 && (
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Últimas Operações</legend>
                    <div className="mt-4"><GenericDetailsTable records={operacoes} /></div>
                </fieldset>
            )}

            {patrulhamentos.length > 0 && (
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Últimos Patrulhamentos</legend>
                    <div className="mt-4"><GenericDetailsTable records={patrulhamentos} /></div>
                </fieldset>
            )}

            {detidos.length > 0 && (
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Últimos Detidos</legend>
                    <div className="mt-4"><GenericDetailsTable records={detidos} /></div>
                </fieldset>
            )}
        </div>
    );
};

const TransportesDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
    const combustivel = records.filter(r => r.categoria === 'Municípios');
    const membros = records.filter(r => r.categoria === 'Membros');
    const manutencoes = records.filter(r => r.categoria === 'Manutenções');

    const fuelByMunicipality = combustivel.reduce((acc, record) => {
        const municipio = record.municipio as string;
        const quantidade = Number(record.quantidadeRecebida) || 0;
        if (municipio) {
            acc[municipio] = (acc[municipio] || 0) + quantidade;
        }
        return acc;
    }, {} as Record<string, number>);

    const fuelChartData = Object.entries(fuelByMunicipality).map(([name, value]) => ({ name, value }));
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                 <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total Combustível (L)</h4>
                    <p className="text-2xl font-bold text-gray-800">{combustivel.reduce((sum, r) => sum + Number(r.quantidade || 0), 0)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total Membros</h4>
                    <p className="text-2xl font-bold text-gray-800">{membros.length}</p>
                </div>
                 <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Total Manutenções</h4>
                    <p className="text-2xl font-bold text-gray-800">{manutencoes.length}</p>
                </div>
            </div>

            {fuelChartData.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="h-64">
                        <h4 className="text-md font-semibold text-center text-gray-700 mb-2">Distribuição de Combustível por Município</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={fuelChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                    {fuelChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} L`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="overflow-x-auto">
                         <GenericDetailsTable records={combustivel} title="Últimos Registos de Combustível" />
                    </div>
                </div>
            )}
            
            {manutencoes.length > 0 && (
                 <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Registo de Manutenções</legend>
                    <div className="mt-4"><GenericDetailsTable records={manutencoes} /></div>
                </fieldset>
            )}
        </div>
    );
};

type LogisticaSubCategory = 'Armamento' | 'Viveres' | 'Vestuario';

const LogisticaDetailsView: React.FC<{ records: DataRecord[] }> = ({ records }) => {
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
                    <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Análise de Armamento</legend>
                        {filteredArmamento.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhum registo encontrado.</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                <div className="h-64 md:col-span-1">
                                    <h4 className="text-md font-semibold text-center text-gray-700 mb-2">Distribuição por Tipo</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={armamentoByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                                {armamentoByType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="md:col-span-2 overflow-x-auto">
                                    <h4 className="text-md font-semibold text-gray-700 mb-2">Últimos Registos de Armamento</h4>
                                    <table className="w-full text-sm">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2">Agente</th>
                                                <th className="px-4 py-2">Tipo</th>
                                                <th className="px-4 py-2">N/S</th>
                                                <th className="px-4 py-2">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredArmamento.slice(0, 5).map(r => (
                                                <tr key={r.id} className="border-b">
                                                    <td className="px-4 py-2">{r.agenteNome}</td>
                                                    <td className="px-4 py-2">{r.tipoArmamento}</td>
                                                    <td className="px-4 py-2">{r.numSerieArma}</td>
                                                    <td className="px-4 py-2">{r.estadoArma}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </fieldset>
                );
            case 'Viveres':
                return (
                    <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Controlo de Viveres</legend>
                        {filteredViveres.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhum registo encontrado.</p> : (
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-sm">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2">Descrição</th>
                                            <th className="px-4 py-2">Quantidade</th>
                                            <th className="px-4 py-2">Validade</th>
                                            <th className="px-4 py-2">Unidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredViveres.map(r => (
                                            <tr key={r.id} className="border-b">
                                                <td className="px-4 py-2">{r.descViveres}</td>
                                                <td className="px-4 py-2">{r.qtdViveres}</td>
                                                <td className="px-4 py-2">{r.validadeViveres}</td>
                                                <td className="px-4 py-2">{r.unidadeViveres}</td>
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
                    <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Controlo de Vestuário</legend>
                        {filteredVestuario.length === 0 ? <p className="text-center text-gray-500 py-4">Nenhum registo encontrado.</p> : (
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2">Tipo</th>
                                            <th className="px-4 py-2">Estado</th>
                                            <th className="px-4 py-2">Tamanho</th>
                                            <th className="px-4 py-2">Quantidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredVestuario.map(r => (
                                            <tr key={r.id} className="border-b">
                                                <td className="px-4 py-2">{r.tipoVestuario}</td>
                                                <td className="px-4 py-2">{r.estadoVestuario}</td>
                                                <td className="px-4 py-2">{r.tamanhoVestuario}</td>
                                                <td className="px-4 py-2">{r.qtdVestuario}</td>
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
                            className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${isActive ? 'bg-custom-blue-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>Total {cat}</h4>
                            <p className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>{total}</p>
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
};

const DashboardDetails: React.FC<{ category: DashboardCategory }> = ({ category }) => {
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
    }, [category]);
    
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
        const interval = setInterval(fetchTotals, 5000); // Refresh totals every 5 seconds
        return () => clearInterval(interval);
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