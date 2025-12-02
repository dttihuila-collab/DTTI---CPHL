
import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { DashboardCategory, DataRecord, User, Role, ApiKey } from '../types';
import { api } from '../services/api';
import { Input, Label, Button } from '../components/common/FormElements';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, DeleteIcon } from '../components/icons/Icon';
import { AuthContext } from '../contexts/AuthContext';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';

const TABS: DashboardCategory[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];

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
    const { refreshKey, triggerRefresh } = useDataRefresh();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<DashboardCategory>(TABS[0]);
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<DataRecord | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const availableTabs = useMemo(() => {
        if (user?.role === Role.Admin) return TABS;
        if (user?.role === Role.Padrao) {
            return TABS.filter(tab => user.permissions?.includes(tab));
        }
        return [];
    }, [user]);

    useEffect(() => {
        if(availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
            setActiveTab(availableTabs[0]);
        }
    }, [availableTabs, activeTab]);

    const fetchRecords = useCallback(async () => {
        if (!activeTab) return;
        setIsLoading(true);
        try {
            const apiKey = categoryToApiKey(activeTab);
            const data = await api.getRecords(apiKey);
            setRecords(data.reverse());
        } catch (err) {
            addToast('Falha ao carregar os registos.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, addToast]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords, refreshKey]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, dateFrom, dateTo]);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const recordDate = record.createdAt ? new Date(record.createdAt) : new Date(record.data);
            const from = dateFrom ? new Date(dateFrom) : null;
            if (from) from.setHours(0, 0, 0, 0);
            const to = dateTo ? new Date(dateTo) : null;
            if (to) to.setHours(23, 59, 59, 999);

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

    const openDeleteModal = (record: DataRecord) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setRecordToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        try {
            await api.deleteRecord(categoryToApiKey(activeTab), recordToDelete.id);
            addToast('Registo eliminado com sucesso!', 'success');
            triggerRefresh(); // This will trigger a re-fetch in fetchRecords effect
        } catch {
            addToast('Falha ao eliminar o registo.', 'error');
        } finally {
            closeDeleteModal();
        }
    };
    
    const exportToCsv = () => {
        if (filteredRecords.length === 0) {
            addToast('Nenhum dado para exportar.', 'info');
            return;
        }
        const headers = Object.keys(filteredRecords[0]).join(',');
        const rows = filteredRecords.map(row => 
            Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${activeTab.toLowerCase().replace(/ /g, '_')}_relatorio.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast('Dados exportados com sucesso!', 'success');
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
                <Button onClick={exportToCsv}>Exportar Dados</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200"><nav className="-mb-px flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">{availableTabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? 'border-custom-blue-500 text-custom-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{tab}</button>))}</nav></div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="md:col-span-1"><Label htmlFor="search">Pesquisar</Label><Input id="search" type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div><Label htmlFor="dateFrom">De</Label><Input id="dateFrom" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div><div><Label htmlFor="dateTo">Até</Label><Input id="dateTo" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div></div>
                    {isLoading ? <p>A carregar...</p> : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr>{paginatedRecords.length > 0 && [...Object.keys(paginatedRecords[0]), 'Ações'].map(key => (<th key={key} scope="col" className="px-6 py-3">{key}</th>))}</tr></thead>
                                    <tbody>{paginatedRecords.map(record => (<tr key={record.id} className="bg-white border-b hover:bg-gray-50">{Object.entries(record).map(([key, value]) => (<td key={key} className="px-6 py-4 whitespace-nowrap">{String(value)}</td>))}<td className="px-6 py-4 whitespace-nowrap space-x-2"><button onClick={() => alert('Funcionalidade de edição em desenvolvimento.')} className="text-custom-blue-600 hover:text-custom-blue-800"><EditIcon /></button><button onClick={() => openDeleteModal(record)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button></td></tr>))}</tbody>
                                </table>
                            </div>
                            {filteredRecords.length === 0 && <div className="text-center py-8 text-gray-500">Nenhum registo encontrado.</div>}
                            {totalPages > 1 && (<div className="flex justify-between items-center mt-4"><span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span><div className="inline-flex rounded-md shadow-sm"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"><ChevronLeftIcon /></button><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="-ml-px px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"><ChevronRightIcon /></button></div></div>)}
                        </>
                    )}
                </div>
            </div>
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Eliminação">
                <p>Tem a certeza que deseja eliminar este registo? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Relatorios;
