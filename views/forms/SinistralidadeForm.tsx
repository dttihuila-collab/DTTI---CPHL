import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS, TIPOS_ACIDENTE } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { SinistralidadeRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<SinistralidadeRecord> = {
    data: '',
    periodo: '',
    municipio: '',
    unidadeEsquadra: '',
    tipoAcidente: '',
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            description="Preencha os detalhes abaixo para registar uma nova ocorrência de sinistralidade."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Localização e Tempo" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" value={formData.data || ''} onChange={handleChange} required /></div>
                        <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo" value={formData.periodo || ''} onChange={handleChange} required><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                        <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange} required><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
                        <div><Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label><Select id="unidadeEsquadra" name="unidadeEsquadra" value={formData.unidadeEsquadra || ''} onChange={handleChange} required><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                        <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" name="comuna" type="text" value={formData.comuna || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" type="text" value={formData.bairro || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="rua">Rua</Label><Input id="rua" name="rua" type="text" value={formData.rua || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" value={formData.local || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="pontoReferencia">Ponto de Referência</Label><Input id="pontoReferencia" name="pontoReferencia" type="text" value={formData.pontoReferencia || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Detalhes do Acidente">
                    <div className="grid grid-cols-1 gap-6 mt-4">
                        <div><Label htmlFor="tipoAcidente">Tipo de Acidente</Label><Select id="tipoAcidente" name="tipoAcidente" value={formData.tipoAcidente || ''} onChange={handleChange} required><option value="">Selecione o tipo de acidente</option>{TIPOS_ACIDENTE.map(a => <option key={a} value={a}>{a}</option>)}</Select></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Dados das Vítimas">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="vitimaNome">Nome</Label><Input id="vitimaNome" name="vitimaNome" type="text" value={formData.vitimaNome || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="vitimaIdade">Idade</Label><Input id="vitimaIdade" name="vitimaIdade" type="number" value={formData.vitimaIdade || ''} onChange={handleChange}/></div>
                         <div>
                            <Label htmlFor="vitimaEstado">Estado</Label>
                            <Select id="vitimaEstado" name="vitimaEstado" value={formData.vitimaEstado || ''} onChange={handleChange}>
                                <option value="">Selecione o estado</option>
                                <option value="Fatal">Fatal</option>
                                <option value="Grave">Grave</option>
                                <option value="Ligeiro">Ligeiro</option>
                                <option value="Ileso">Ileso</option>
                            </Select>
                        </div>
                        <div><Label htmlFor="vitimaVeiculo">Veículo</Label><Input id="vitimaVeiculo" name="vitimaVeiculo" type="text" value={formData.vitimaVeiculo || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Observações">
                   <div className="mt-4">
                       <Label htmlFor="observacoes" className="sr-only">Observações</Label>
                       <Textarea id="observacoes" name="observacoes" value={formData.observacoes || ''} onChange={handleChange} placeholder="Adicione quaisquer observações ou detalhes adicionais..." />
                   </div>
               </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default SinistralidadeForm;