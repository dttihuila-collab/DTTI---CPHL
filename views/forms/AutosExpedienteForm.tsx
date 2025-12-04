import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TIPOS_AUTO_EXPEDIENTE, UNIDADES_ESQUADRAS } from '../../constants';
import { AutosExpedienteRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import EditableSelect from '../../components/common/EditableSelect';

const initialFormData: Partial<AutosExpedienteRecord> = {
    tipoAuto: '',
    dataAuto: '',
    esquadra: '',
    agenteResponsavel: '',
    descricaoFactos: '',
};

interface AutosExpedienteFormProps {
    initialData?: Partial<AutosExpedienteRecord>;
    editingRecord?: AutosExpedienteRecord | null;
    onSave?: (record: AutosExpedienteRecord) => void;
    onCancel?: () => void;
}

const AutosExpedienteForm: React.FC<AutosExpedienteFormProps> = React.memo(({ initialData, editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<AutosExpedienteRecord>>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (editingRecord) {
            setFormData(editingRecord);
        } else if (initialData?.tipoAuto) {
            setFormData({ ...initialFormData, tipoAuto: initialData.tipoAuto || '' });
        } else {
            setFormData(initialFormData);
        }
    }, [initialData, editingRecord]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (onSave) {
                onSave(formData as AutosExpedienteRecord);
            } else {
                await api.addRecord('autosExpediente', formData);
                addToast('Auto de Expediente registado com sucesso!', 'success');
                triggerRefresh();
                setFormData({ ...initialFormData, tipoAuto: initialData?.tipoAuto || '' });
            }
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderInvolvedPartyFields = () => {
         const hasNoticiante = ['Auto de Queixa', 'Auto de Apreensão'].includes(formData.tipoAuto || '');
         const hasQueixado = ['Auto de Queixa'].includes(formData.tipoAuto || '');

         if (!hasNoticiante && !hasQueixado) return null;

         return (
             <CollapsibleSection title="Partes Envolvidas" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {hasNoticiante && (
                        <div>
                            <Label htmlFor="noticianteNome">Nome do Noticiante/Autuado</Label>
                            <Input id="noticianteNome" name="noticianteNome" value={formData.noticianteNome || ''} onChange={handleChange} />
                        </div>
                    )}
                    {hasQueixado && (
                        <div>
                            <Label htmlFor="queixadoNome">Nome do Queixado</Label>
                            <Input id="queixadoNome" name="queixadoNome" value={formData.queixadoNome || ''} onChange={handleChange} />
                        </div>
                    )}
                </div>
            </CollapsibleSection>
         )
    }

    return (
        <FormWrapper
            title={editingRecord ? `Editar ${formData.tipoAuto} (${formData.numeroAuto})` : `Registo de ${formData.tipoAuto || 'Auto de Expediente'}`}
            description="Preencha os detalhes abaixo para registar um novo Auto de Expediente."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Dados Gerais do Auto" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <div className="lg:col-span-2"><Label>Tipo de Auto</Label><Select name="tipoAuto" value={formData.tipoAuto} onChange={handleChange} required disabled={!!editingRecord || !!initialData?.tipoAuto}><option value="">Selecione</option>{TIPOS_AUTO_EXPEDIENTE.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
                        { editingRecord && <div className="lg:col-span-2"><Label>Nº do Auto</Label><Input name="numeroAuto" value={formData.numeroAuto || ''} disabled /></div> }
                        <div><Label>Data</Label><Input name="dataAuto" type="date" value={formData.dataAuto || ''} onChange={handleChange} required/></div>
                        <EditableSelect label="Esquadra" id="esquadra" name="esquadra" value={formData.esquadra || ''} onChange={handleChange} options={UNIDADES_ESQUADRAS} storageKey="sccphl_custom_unidades_esquadras" required />
                        <div className="lg:col-span-2"><Label>Agente Responsável</Label><Input name="agenteResponsavel" value={formData.agenteResponsavel || ''} onChange={handleChange} required/></div>
                    </div>
                </CollapsibleSection>
                {renderInvolvedPartyFields()}
                <CollapsibleSection title="Descrição dos Factos" defaultOpen>
                    <div className="mt-4">
                        <Textarea name="descricaoFactos" rows={8} value={formData.descricaoFactos || ''} onChange={handleChange} required />
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default AutosExpedienteForm;