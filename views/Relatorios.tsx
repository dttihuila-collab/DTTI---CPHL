import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { DashboardCategory, DataRecord, Role, ApiKey, CriminalidadeRecord, FamíliaCriminal } from '../types';
import { api } from '../services/api';
import { Input, Label, Button, Select, FormError } from '../components/common/FormElements';
import { EditIcon, DeleteIcon } from '../components/icons/Icon';
import { AuthContext } from '../contexts/AuthContext';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import { MUNICIPIOS_HUILA, FAMILIAS_CRIMINAIS, CRIMES_POR_FAMILIA } from '../constants';
import { DataTable, ColumnDef } from '../components/common/DataTable';

const TABS: DashboardCategory[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais', 'Transportes', 'Logística'];

const categoryToApiKey = (category: DashboardCategory): ApiKey => {
    switch (category) {
        case 'Criminalidade': return 'criminalidade';
        case 'Sinistralidade Rodoviária': return 'sinistralidade';
        case 'Resultados Operacionais': return 'resultados';
        case 'Transportes': return 'transportes';
        case 'Logística': return 'logistica';
        default: return 'criminalidade';
    }
}

// Edit Modal for Criminalidade
const EditCriminalidadeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    record: CriminalidadeRecord | null;
    onSave: (record: CriminalidadeRecord) => void;
}> = React.memo(({ isOpen, onClose, record, onSave }) => {
    const [formData, setFormData] = useState<Partial<CriminalidadeRecord> | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (record) {
            setFormData(record);
        }
    }, [record]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = prev ? { ...prev, [name]: value } : null;
            if (name === 'familiaCriminal' && newState) {
                newState.crime = '';
            }
            return newState;
        });
    };

    const handleSave = async () => {
        if (!formData) return;
        const newErrors: Record<string, string> = {};
        if (!formData.municipio) newErrors.municipio = 'Município é obrigatório.';
        if (!formData.crime) newErrors.crime = 'Crime é obrigatório.';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            await onSave(formData as CriminalidadeRecord);
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !formData) return null;

    const crimes = formData.familiaCriminal ? CRIMES_POR_FAMILIA[formData.familiaCriminal as FamíliaCriminal] || [] : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Registo de Criminalidade">
            <div className="space-y-4">
                <div><Label>Data da Ocorrência</Label><Input type="datetime-local" name="data" value={formData.data || ''} onChange={handleChange} /></div>
                <div><Label>Município</Label><Select name="municipio" value={formData.municipio || ''} onChange={handleChange} error={!!errors.municipio}><option value="">Selecione</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select><FormError message={errors.municipio} /></div>
                <div><Label>Família Criminal</Label><Select name="familiaCriminal" value={formData.familiaCriminal || ''} onChange={handleChange}><option value="">Selecione</option>{FAMILIAS_CRIMINAIS.map(f => <option key={f} value={f}>{f}</option>)}</Select></div>
                <div><Label>Crime</Label><Select name="crime" value={formData.crime || ''} onChange={handleChange} error={!!errors.crime} disabled={!formData.familiaCriminal}><option value="">Selecione</option>{crimes.map(c => <option key={c} value={c}>{c}</option>)}</Select><FormError message={errors.crime} /></div>
                <div><Label>Nome da Vítima</Label><Input name="vitimaNome" value={formData.vitimaNome || ''} onChange={handleChange} /></div>
                <div><Label>Nome do Acusado</Label><Input name="acusadoNome" value={formData.acusadoNome || ''} onChange={handleChange} /></div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
                    <Button onClick={handleSave} isLoading={isSubmitting}>Guardar</Button>
                </div>
            </div>
        </Modal>
    );
});


const Relatorios: React.FC = React.memo(() => {
    const { user } = useContext(AuthContext);
    const { refreshKey, triggerRefresh } = useDataRefresh();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<DashboardCategory>(TABS[0]);
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<DataRecord | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<DataRecord | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    
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

    const openDeleteModal = (record: DataRecord) => { setRecordToDelete(record); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setRecordToDelete(null); setIsDeleteModalOpen(false); };
    const openEditModal = (record: DataRecord) => { setRecordToEdit(record); setIsEditModalOpen(true); };
    const closeEditModal = () => { setRecordToEdit(null); setIsEditModalOpen(false); };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        try {
            await api.deleteRecord(categoryToApiKey(activeTab), recordToDelete.id);
            addToast('Registo eliminado com sucesso!', 'success');
            triggerRefresh();
        } catch { addToast('Falha ao eliminar o registo.', 'error'); } finally { closeDeleteModal(); }
    };
    
    const handleSave = async (updatedRecord: DataRecord) => {
        try {
            await api.updateRecord(categoryToApiKey(activeTab), updatedRecord);
            addToast('Registo atualizado com sucesso!', 'success');
            triggerRefresh();
        } catch { addToast('Falha ao atualizar o registo.', 'error'); } finally { closeEditModal(); }
    }
    
    const exportToCsv = () => {
        if (filteredRecords.length === 0) {
            addToast('Nenhum dado para exportar.', 'info');
            return;
        }
        const headers = Object.keys(filteredRecords[0]).join(',');
        const rows = filteredRecords.map(row => Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(','));
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
        return <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md"><h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Acesso Restrito</h2><p className="mt-2 text-gray-500 dark:text-gray-400">Não tem permissão para visualizar relatórios.</p></div>;
    }

    const columns = useMemo(() => {
        if(filteredRecords.length === 0) return [];
        return Object.keys(filteredRecords[0]).map(key => ({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        })) as ColumnDef<DataRecord>[];
    }, [filteredRecords]);

    const renderRowActions = (record: DataRecord) => (
         <>
            <button onClick={() => {
                // Alerta temporário para categorias sem modal de edição
                if (activeTab !== 'Criminalidade') {
                    alert('A edição para esta categoria ainda não foi implementada.');
                    return;
                }
                openEditModal(record)
            }} className="text-custom-blue-600 hover:text-custom-blue-800 dark:text-custom-blue-400 dark:hover:text-custom-blue-300"><EditIcon /></button>
            <button onClick={() => openDeleteModal(record)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Relatórios</h2><Button onClick={exportToCsv}>Exportar Dados</Button></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700"><nav className="-mb-px flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">{availableTabs.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? 'border-custom-blue-500 text-custom-blue-600 dark:text-custom-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{tab}</button>))}</nav></div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="md:col-span-1">
                            <Label htmlFor="search">Pesquisar</Label>
                            <Input id="search" type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                    
                    <DataTable
                        columns={columns}
                        data={filteredRecords}
                        isLoading={isLoading}
                        renderRowActions={renderRowActions}
                    />
                </div>
            </div>
            {activeTab === 'Criminalidade' && <EditCriminalidadeModal isOpen={isEditModalOpen} onClose={closeEditModal} record={recordToEdit as CriminalidadeRecord} onSave={handleSave as (r: CriminalidadeRecord) => void} />}
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Eliminação">
                <p className="text-gray-700 dark:text-gray-300">Tem a certeza de que deseja eliminar este registo? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-2 pt-6"><Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Eliminar</Button></div>
            </Modal>
        </div>
    );
});

export default Relatorios;