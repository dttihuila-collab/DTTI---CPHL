import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DataRecord, ApiKey, CriminalidadeRecord, FamíliaCriminal, SinistralidadeRecord, EnfrentamentoRecord } from '../types';
import { api } from '../services/api';
import { Input, Label, Button, Select, FormError } from '../components/common/FormElements';
import { EditIcon, DeleteIcon } from '../components/icons/Icon';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import { DataTable, ColumnDef } from '../components/common/DataTable';
import CriminalidadeForm from './forms/CriminalidadeForm';
import SinistralidadeForm from './forms/SinistralidadeForm';
import EnfrentamentoForm from './forms/ResultadosForm';

type OcorrenciaCategory = 'Criminalidade' | 'Sinistralidade Rodoviária' | 'Enfrentamento Policial';

const TABS: OcorrenciaCategory[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Enfrentamento Policial'];

const categoryToApiKey = (category: OcorrenciaCategory): ApiKey => {
    switch (category) {
        case 'Criminalidade': return 'criminalidade';
        case 'Sinistralidade Rodoviária': return 'sinistralidade';
        case 'Enfrentamento Policial': return 'enfrentamento';
    }
}

const ConsultaOcorrencias: React.FC = React.memo(() => {
    const { refreshKey, triggerRefresh } = useDataRefresh();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<OcorrenciaCategory>('Criminalidade');
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<DataRecord | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<DataRecord | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRecords = useCallback(async () => {
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
    }, [fetchRecords, refreshKey, activeTab]);
    
    const filteredRecords = useMemo(() => {
        if (!searchTerm) return records;
        const lowercasedFilter = searchTerm.toLowerCase();
        return records.filter(record => 
            Object.values(record).some(value => 
                String(value).toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [records, searchTerm]);

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
    
    const columns = useMemo(() => {
        if(filteredRecords.length === 0) return [];
        return Object.keys(filteredRecords[0]).filter(key => key !== 'id' && key !== 'createdAt').map(key => ({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        })) as ColumnDef<DataRecord>[];
    }, [filteredRecords]);

    const renderRowActions = (record: DataRecord) => (
         <div className="flex items-center space-x-2">
            <button onClick={() => openEditModal(record)} className="text-custom-blue-600 hover:text-custom-blue-800 dark:text-custom-blue-400 dark:hover:text-custom-blue-300"><EditIcon /></button>
            <button onClick={() => openDeleteModal(record)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
        </div>
    );

    const renderEditModal = () => {
        if (!isEditModalOpen || !recordToEdit) return null;
        
        const onSaveAndClose = (record: DataRecord) => {
            handleSave(record);
            closeEditModal();
        }

        switch (activeTab) {
            case 'Criminalidade':
                return <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Registo de Criminalidade"><CriminalidadeForm editingRecord={recordToEdit as CriminalidadeRecord} onSave={onSaveAndClose} onCancel={closeEditModal} /></Modal>;
            case 'Sinistralidade Rodoviária':
                return <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Registo de Sinistralidade"><SinistralidadeForm editingRecord={recordToEdit as SinistralidadeRecord} onSave={onSaveAndClose} onCancel={closeEditModal} /></Modal>;
            case 'Enfrentamento Policial':
                return <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Registo de Enfrentamento"><EnfrentamentoForm editingRecord={recordToEdit as EnfrentamentoRecord} onSave={onSaveAndClose} onCancel={closeEditModal} /></Modal>;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Consultar Ocorrências</h2></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700"><nav className="-mb-px flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">{TABS.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? 'border-custom-blue-500 text-custom-blue-600 dark:text-custom-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{tab}</button>))}</nav></div>
                <div className="p-6">
                    <div className="mb-6 max-w-sm">
                        <Label htmlFor="search">Pesquisar</Label>
                        <Input id="search" type="text" placeholder="Pesquisar em todos os campos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    
                    <DataTable
                        columns={columns}
                        data={filteredRecords}
                        isLoading={isLoading}
                        renderRowActions={renderRowActions}
                    />
                </div>
            </div>
            {renderEditModal()}
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Eliminação">
                <p className="text-gray-700 dark:text-gray-300">Tem a certeza de que deseja eliminar este registo? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-2 pt-6"><Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Eliminar</Button></div>
            </Modal>
        </div>
    );
});

export default ConsultaOcorrencias;