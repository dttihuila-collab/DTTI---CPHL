import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { EnfrentamentoRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import EditableSelect from '../../components/common/EditableSelect';

const initialFormData: Partial<EnfrentamentoRecord> = {
    tipoRegisto: 'Operação',
    data: '',
    municipio: '',
    unidadeResponsavel: ''
};

interface EnfrentamentoFormProps {
    editingRecord?: EnfrentamentoRecord | null;
    onSave?: (record: EnfrentamentoRecord) => void;
    onCancel?: () => void;
}

const EnfrentamentoForm: React.FC<EnfrentamentoFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<EnfrentamentoRecord>>(initialFormData);
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
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseInt(value) || '' : value;
        
        const updatedState = { ...formData, [name]: finalValue };

        // Reset fields when type changes
        if (name === 'tipoRegisto') {
            const commonFields = { tipoRegisto: finalValue, data: updatedState.data, unidadeResponsavel: updatedState.unidadeResponsavel, municipio: updatedState.municipio };
            setFormData(commonFields);
        } else {
            setFormData(updatedState);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (onSave) {
                onSave(formData as EnfrentamentoRecord);
            } else {
                await api.addRecord('enfrentamento', formData);
                addToast('Enfrentamento Policial submetido com sucesso!', 'success');
                triggerRefresh();
                setFormData(initialFormData);
                if (onCancel) onCancel(); // Go back after submission
            }
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderDynamicFields = () => {
        switch(formData.tipoRegisto) {
            case 'Operação':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><Label htmlFor="nomeOperacao">Nome da Operação</Label><Input id="nomeOperacao" name="nomeOperacao" type="text" value={formData.nomeOperacao || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="objetivoOperacao">Objetivo</Label><Input id="objetivoOperacao" name="objetivoOperacao" type="text" value={formData.objetivoOperacao || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-2"><Label htmlFor="resultadosOperacao">Resultados (Apreensões, etc.)</Label><Textarea id="resultadosOperacao" name="resultadosOperacao" value={formData.resultadosOperacao || ''} onChange={handleChange} /></div>
                    </div>
                );
            case 'Patrulhamento':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="tipoPatrulhamento">Tipo de Patrulhamento</Label>
                            <Select id="tipoPatrulhamento" name="tipoPatrulhamento" value={formData.tipoPatrulhamento || ''} onChange={handleChange}>
                                <option value="">Selecione o tipo</option>
                                <option value="Apeado">Apeado</option><option value="Auto">Auto</option><option value="Misto">Misto</option>
                            </Select>
                        </div>
                        <div><Label htmlFor="areaPatrulhada">Área Patrulhada</Label><Input id="areaPatrulhada" name="areaPatrulhada" type="text" value={formData.areaPatrulhada || ''} onChange={handleChange} /></div>
                    </div>
                );
            case 'Detenção':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2"><Label htmlFor="nomeDetido">Nome do Detido</Label><Input id="nomeDetido" name="nomeDetido" type="text" value={formData.nomeDetido || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="idadeDetido">Idade</Label><Input id="idadeDetido" name="idadeDetido" type="number" value={formData.idadeDetido || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label htmlFor="motivoDetencao">Motivo da Detenção</Label><Input id="motivoDetencao" name="motivoDetencao" type="text" value={formData.motivoDetencao || ''} onChange={handleChange} /></div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <FormWrapper
            title={editingRecord ? "Editar Enfrentamento Policial" : "Registo de Enfrentamento Policial"}
            description="Selecione o tipo de registo e preencha os detalhes."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Dados Gerais" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="tipoRegisto">Tipo de Registo</Label><Select id="tipoRegisto" name="tipoRegisto" value={formData.tipoRegisto || ''} onChange={handleChange} required><option value="Operação">Operação</option><option value="Patrulhamento">Patrulhamento</option><option value="Detenção">Detenção</option></Select></div>
                        <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" value={formData.data || ''} onChange={handleChange} required /></div>
                        <EditableSelect label="Unidade Responsável" id="unidadeResponsavel" name="unidadeResponsavel" value={formData.unidadeResponsavel || ''} onChange={handleChange} options={UNIDADES_ESQUADRAS} storageKey="sccphl_custom_unidades_esquadras" required />
                        <EditableSelect label="Município" id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange} options={MUNICIPIOS_HUILA} storageKey="sccphl_custom_municipios" required />
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Detalhes Específicos" defaultOpen>
                    <div className="mt-4">
                      {renderDynamicFields()}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Outras Informações">
                    <div className="mt-4">
                        <Label htmlFor="observacoes" className="sr-only">Observações</Label>
                        <Textarea id="observacoes" name="observacoes" value={formData.observacoes || ''} onChange={handleChange} placeholder="Adicione aqui outras informações relevantes..." />
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default EnfrentamentoForm;