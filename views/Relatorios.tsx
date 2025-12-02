import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
// FIX: Imported ApiKey type to resolve reference error.
import { DashboardCategory, DataRecord, User, Role, ApiKey } from '../types';
import { api } from '../services/api';
import { Input, Label, Button } from '../components/common/FormElements';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons/Icon';
import { AuthContext } from '../App';

const TABS: DashboardCategory[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];

// FIX: Replaced `keyof Omit<typeof db, 'users'>` with `ApiKey` to fix "Cannot find name 'db'" error.
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

const ITEMS_PER_PAGE = 10;

const Relatorios: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<DashboardCategory>(TABS[0]);
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const availableTabs = useMemo(() => {
        if (user?.role === Role.Admin) {
            return TABS;
        }
        if (user?.role === Role.Padrao) {
            const formViews: DashboardCategory[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];
            return formViews.filter(tab => user.permissions?.includes(tab));
        }
        return [];
    }, [user]);

    useEffect(() => {
        if(availableTabs.length > 0) {
            setActiveTab(availableTabs[0]);
        }
    }, [availableTabs]);

    const fetchRecords = useCallback(async () => {
        if (!activeTab) return;
        setIsLoading(true);
        setError(null);
        try {
            const apiKey = categoryToApiKey(activeTab);
            const data = await api.getRecords(apiKey);
            setRecords(data.reverse());
        } catch (err) {
            setError('Falha ao carregar os registos.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchRecords();
        setCurrentPage(1);
    }, [fetchRecords]);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const recordDate = new Date(record.createdAt);
            const from = dateFrom ? new Date(dateFrom) : null;
            const to = dateTo ? new Date(dateTo) : null;

            if (from && recordDate < from) return false;
            if (to && recordDate > to) return false;

            if (searchTerm) {
                return Object.values(record).some(value => 
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            return true;
        });
    }, [records, searchTerm, dateFrom, dateTo]);

    const paginatedRecords = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRecords, currentPage]);

    const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    if (availableTabs.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700">Acesso Restrito</h2>
                <p className="mt-2 text-gray-500">Não tem permissão para visualizar relatórios.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Relatórios</h2>
                <Button onClick={() => alert('Funcionalidade de exportação em desenvolvimento!')}>Exportar Dados</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">
                        {availableTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-custom-blue-500 text-custom-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="md:col-span-1">
                            <Label htmlFor="search">Pesquisar</Label>
                            <Input id="search" type="text" placeholder="Pesquisar em todos os campos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="dateFrom">De</Label>
                            <Input id="dateFrom" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="dateTo">Até</Label>
                            <Input id="dateTo" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                        </div>
                    </div>

                    {isLoading && <p>A carregar...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!isLoading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            {paginatedRecords.length > 0 && Object.keys(paginatedRecords[0]).map(key => (
                                                <th key={key} scope="col" className="px-6 py-3">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRecords.map(record => (
                                            <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                                                {Object.entries(record).map(([key, value]) => (
                                                    <td key={key} className="px-6 py-4 whitespace-nowrap">{String(value)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredRecords.length === 0 && <div className="text-center py-8 text-gray-500">Nenhum registo encontrado.</div>}

                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-sm text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <div className="inline-flex rounded-md shadow-sm">
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50">
                                            <ChevronLeftIcon />
                                        </button>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="-ml-px px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50">
                                            <ChevronRightIcon />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Relatorios;