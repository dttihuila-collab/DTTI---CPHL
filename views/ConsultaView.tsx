import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardCategory, DataRecord, ApiKey, CriminalidadeRecord, FamíliaCriminal, LogisticaRecord } from '../types';
import { api } from '../services/api';
import { Input, Label, Button, Select, FormError } from '../components/common/FormElements';
import { EditIcon, DeleteIcon, AddIcon, ChevronLeftIcon } from '../components/icons/Icon';
import { useDataRefresh } from '../contexts/DataRefreshContext';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import { MUNICIPIOS_HUILA, FAMILIAS_CRIMINAIS, CRIMES_POR_FAMILIA } from '../constants';
import { DataTable, ColumnDef } from '../components/common/DataTable';

interface ConsultaViewProps {
  category: DashboardCategory;
  onBack: () => void;
  onRegisterNew: () => void;
}

const categoryToApiKey = (category: DashboardCategory): ApiKey => {
    switch (category) {
        case 'Criminalidade': return 'criminalidade';
        case 'Sinistralidade Rodoviária': return 'sinistralidade';
        case 'Resultados Operacionais': return 'resultados';
        case 'Transportes': return 'transportes';
        case 'Logística': return 'logistica';
        case 'Autos de Expediente': return 'autosExpediente';
        case 'Processos': return 'processos';
        default: return 'criminalidade';
    }
}

// Edit Modal (copied from Relatorios.tsx, could be refactored further)
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


const ConsultaView: React.FC<ConsultaViewProps> = ({ category, onBack, onRegisterNew }) => {
    const { refreshKey, triggerRefresh } = useDataRefresh();
    const { addToast } = useToast();
    
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<DataRecord | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<DataRecord | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        try {
            const apiKey = categoryToApiKey(category);
            const data = await api.getRecords(apiKey);
            setRecords(data.reverse());
        } catch (err) {
            addToast('Falha ao carregar os registos.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [category, addToast]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords, refreshKey]);
    
    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const recordDate = record.createdAt ? new Date(record.createdAt) : new Date(record.data || record.dataAuto);
            const from = dateFrom ? new Date(dateFrom) : null;
            if (from) from.setHours(0, 0, 0, 0);
            const to = dateTo ? new Date(dateTo) : null;
            if (to) to.setHours(23, 59, 59, 999);

            if (from && recordDate < from) return false;
            if (to && recordDate > to) return false;

            if (searchTerm) {
                const lowercasedFilter = searchTerm.toLowerCase();
                 const checkMatch = (fields: (keyof typeof record)[]) => {
                    return fields.some(field => {
                        const value = record[field];
                        return value ? String(value).toLowerCase().includes(lowercasedFilter) : false;
                    });
                };
                switch (category) {
                    case 'Criminalidade': return checkMatch(['municipio', 'crime', 'vitimaNome', 'acusadoNome', 'familiaCriminal']);
                    case 'Sinistralidade Rodoviária': return checkMatch(['municipio', 'tipoAcidente', 'vitimaNome', 'vitimaEstado']);
                    case 'Resultados Operacionais': return checkMatch(['tipoOperacao', 'municipio', 'local', 'detidoNome', 'motivoDetencao']);
                    case 'Transportes': return checkMatch(['combustivel', 'municipio', 'nome', 'patente', 'viaturaMatricula']);
                    case 'Logística':
                        const r = record as LogisticaRecord;
                        const fieldsToSearch = r.categoriaLogistica === 'Armamento' ? ['nip', 'nomeCompleto', 'patente', 'numFicha', 'orgaoUnidade'] : ['numRegisto', 'efectivoId', 'tipoFardamento', 'atendente'];
                        return checkMatch(fieldsToSearch);
                    case 'Autos de Expediente': return checkMatch(['numeroAuto', 'tipoAuto', 'noticianteNomeCompleto', 'queixadoNomeCompleto', 'descricaoFactos', 'esquadra']);
                    case 'Processos': return checkMatch(['numeroProcesso', 'tipoProcesso', 'arguido', 'vitima', 'estado']);
                    default: return Object.values(record).some(value => String(value).toLowerCase().includes(lowercasedFilter));
                }
            }
            return true;
        });
    }, [records, searchTerm, dateFrom, dateTo, category]);

    const openDeleteModal = (record: DataRecord) => { setRecordToDelete(record); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setRecordToDelete(null); setIsDeleteModalOpen(false); };
    const openEditModal = (record: DataRecord) => { setRecordToEdit(record); setIsEditModalOpen(true); };
    const closeEditModal = () => { setRecordToEdit(null); setIsEditModalOpen(false); };

    const handleDelete = async () => {
        if (!recordToDelete) return;
        try {
            await api.deleteRecord(categoryToApiKey(category), recordToDelete.id);
            addToast('Registo eliminado com sucesso!', 'success');
            triggerRefresh();
        } catch { addToast('Falha ao eliminar o registo.', 'error'); } finally { closeDeleteModal(); }
    };
    
    const handleSave = async (updatedRecord: DataRecord) => {
        try {
            await api.updateRecord(categoryToApiKey(category), updatedRecord);
            addToast('Registo atualizado com sucesso!', 'success');
            triggerRefresh();
        } catch { addToast('Falha ao atualizar o registo.', 'error'); } finally { closeEditModal(); }
    }
    
    const columns = useMemo(() => {
        if (records.length === 0) return [];
        const keys = Object.keys(records[0]);
        // Filter out keys you don't want as columns
        const filteredKeys = keys.filter(key => !['categoria', 'categoriaLogistica'].includes(key));
        
        return filteredKeys.map(key => ({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        })) as ColumnDef<DataRecord>[];
    }, [records]);

    const renderRowActions = (record: DataRecord) => (
         <>
            <button onClick={() => {
                if (category !== 'Criminalidade') {
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
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={onBack}><ChevronLeftIcon className="mr-2" /> Voltar</Button>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Consulta de {category}</h2>
                </div>
                <Button onClick={onRegisterNew}><AddIcon className="mr-2" /> Registar Novo</Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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

            {category === 'Criminalidade' && <EditCriminalidadeModal isOpen={isEditModalOpen} onClose={closeEditModal} record={recordToEdit as CriminalidadeRecord} onSave={handleSave as (r: CriminalidadeRecord) => void} />}
            
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Eliminação">
                <p className="text-gray-700 dark:text-gray-300">Tem a certeza de que deseja eliminar este registo? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-2 pt-6"><Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Eliminar</Button></div>
            </Modal>
        </div>
    );
};

export default ConsultaView;