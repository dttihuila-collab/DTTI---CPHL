import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, PERIODOS, TIPOS_ACIDENTE, CAUSAS_ACIDENTE } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { SinistralidadeRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import EditableSelect from '../../components/common/EditableSelect';

const initialFormData: Partial<SinistralidadeRecord> = {
    dataAcidente: '',
    periodo: '',
    municipio: '',
    tipoAcidente: '',
    causaPresumivel: '',
    numeroVeiculos: 1,
    numeroVitimas: 0,
    numeroMortos: 0,
    numeroFeridosGraves: 0,
    numeroFeridosLigeiros: 0,
};

interface SinistralidadeFormProps {
    editingRecord?: SinistralidadeRecord | null;
    onSave?: (record: SinistralidadeRecord) => void;
    onCancel?: () => void;
}

const SinistralidadeForm: React.FC<SinistralidadeFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SinistralidadeRecord>>(initialFormData);
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
        const finalValue = type === 'number' ? parseInt(value, 10) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (onSave) {
                onSave(formData as SinistralidadeRecord);
            } else {
                await api.addRecord('sinistralidade', formData);
                addToast('Ocorrência de sinistralidade submetida com sucesso!', 'success');
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
            title={editingRecord ? "Editar Registo de Sinistralidade" : "Registo de Sinistralidade Rodoviária"}
            description="Preencha os detalhes do acidente de viação."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Dados Gerais do Acidente" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="dataAcidente">Data e Hora</Label><Input id="dataAcidente" name="dataAcidente" type="datetime-local" value={formData.dataAcidente || ''} onChange={handleChange} required /></div>
                        <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo" value={formData.periodo || ''} onChange={handleChange}><option value="">Selecione</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                        <EditableSelect label="Município" id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange} options={MUNICIPIOS_HUILA} storageKey="sccphl_custom_municipios" required />
                        <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" value={formData.local || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Tipologia e Causas" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                         <EditableSelect label="Tipo de Acidente" id="tipoAcidente" name="tipoAcidente" value={formData.tipoAcidente || ''} onChange={handleChange} options={TIPOS_ACIDENTE} storageKey="sccphl_custom_tipos_acidente" required />
                         <EditableSelect label="Causa Presumível" id="causaPresumivel" name="causaPresumivel" value={formData.causaPresumivel || ''} onChange={handleChange} options={CAUSAS_ACIDENTE} storageKey="sccphl_custom_causas_acidente" required />
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Balanço de Vítimas e Veículos" defaultOpen>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
                        <div><Label htmlFor="numeroVeiculos">Veículos</Label><Input id="numeroVeiculos" name="numeroVeiculos" type="number" value={formData.numeroVeiculos || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="numeroVitimas">Total Vítimas</Label><Input id="numeroVitimas" name="numeroVitimas" type="number" value={formData.numeroVitimas || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="numeroMortos">Mortos</Label><Input id="numeroMortos" name="numeroMortos" type="number" value={formData.numeroMortos || ''} onChange={handleChange} className="border-red-500" /></div>
                        <div><Label htmlFor="numeroFeridosGraves">Feridos Graves</Label><Input id="numeroFeridosGraves" name="numeroFeridosGraves" type="number" value={formData.numeroFeridosGraves || ''} onChange={handleChange} className="border-orange-500"/></div>
                        <div><Label htmlFor="numeroFeridosLigeiros">Feridos Ligeiros</Label><Input id="numeroFeridosLigeiros" name="numeroFeridosLigeiros" type="number" value={formData.numeroFeridosLigeiros || ''} onChange={handleChange} className="border-yellow-500"/></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Danos e Observações">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                       <div className="md:col-span-1"><Label htmlFor="danosMateriais">Danos Materiais</Label><Textarea id="danosMateriais" name="danosMateriais" value={formData.danosMateriais || ''} onChange={handleChange} placeholder="Descreva os danos materiais..." /></div>
                       <div className="md:col-span-1"><Label htmlFor="descricao">Descrição Adicional</Label><Textarea id="descricao" name="descricao" value={formData.descricao || ''} onChange={handleChange} placeholder="Adicione quaisquer observações ou detalhes adicionais..." /></div>
                   </div>
               </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default SinistralidadeForm;