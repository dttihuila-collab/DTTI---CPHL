import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { ProcessosRecord } from '../../types';
import { TIPOS_PROCESSO, FASES_PROCESSO } from '../../constants';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<ProcessosRecord> = {
    numeroProcesso: '',
    dataAbertura: '',
    tipoProcesso: '',
    faseProcesso: 'Instrução Preparatória'
};

interface ProcessosFormProps {
    editingRecord?: ProcessosRecord | null;
    onSave?: (record: ProcessosRecord) => void;
    onCancel?: () => void;
}

const ProcessosForm: React.FC<ProcessosFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ProcessosRecord>>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (editingRecord) {
            setFormData(editingRecord);
        } else {
            setFormData(initialFormData);
        }
    }, [editingRecord]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
             if (onSave) {
                onSave(formData as ProcessosRecord);
            } else {
                await api.addRecord('processos', formData);
                addToast('Processo registado com sucesso!', 'success');
                triggerRefresh();
                setFormData(initialFormData);
            }
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormWrapper
            title={editingRecord ? "Editar Processo" : "Registo de Processos"}
            description="Preencha os detalhes para registar um novo processo."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <CollapsibleSection title="Detalhes do Processo" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div><Label htmlFor="numeroProcesso">Número do Processo</Label><Input id="numeroProcesso" name="numeroProcesso" type="text" value={formData.numeroProcesso || ''} onChange={handleChange} required /></div>
                    <div><Label htmlFor="dataAbertura">Data de Abertura</Label><Input id="dataAbertura" name="dataAbertura" type="datetime-local" value={formData.dataAbertura || ''} onChange={handleChange} required /></div>
                    <div className="md:col-span-2"><Label htmlFor="tipoProcesso">Tipo de Processo</Label><Select id="tipoProcesso" name="tipoProcesso" value={formData.tipoProcesso || ''} onChange={handleChange} required><option value="">Selecione</option>{TIPOS_PROCESSO.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
                    <div><Label htmlFor="autoOrigemNumero">Nº Auto de Origem (Opcional)</Label><Input id="autoOrigemNumero" name="autoOrigemNumero" type="text" value={formData.autoOrigemNumero || ''} onChange={handleChange} placeholder="Ex: AQ2024/001"/></div>
                    <div><Label htmlFor="faseProcesso">Fase do Processo</Label><Select id="faseProcesso" name="faseProcesso" value={formData.faseProcesso || ''} onChange={handleChange} required><option value="">Selecione</option>{FASES_PROCESSO.map(f => <option key={f} value={f}>{f}</option>)}</Select></div>
                    <div><Label htmlFor="arguido">Arguido</Label><Input id="arguido" name="arguido" type="text" value={formData.arguido || ''} onChange={handleChange} required/></div>
                    <div><Label htmlFor="vitima">Vítima</Label><Input id="vitima" name="vitima" type="text" value={formData.vitima || ''} onChange={handleChange}/></div>
                    <div className="md:col-span-2"><Label htmlFor="observacoes">Observações</Label><Textarea id="observacoes" name="observacoes" value={formData.observacoes || ''} onChange={handleChange} /></div>
                </div>
            </CollapsibleSection>
        </FormWrapper>
    );
});

export default ProcessosForm;