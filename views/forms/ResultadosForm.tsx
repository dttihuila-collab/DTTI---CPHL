import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { ResultadosRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<ResultadosRecord> = {};

interface ResultadosFormProps {
    editingRecord?: ResultadosRecord | null;
    onSave?: (record: ResultadosRecord) => void;
    onCancel?: () => void;
}

const ResultadosForm: React.FC<ResultadosFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ResultadosRecord>>(initialFormData);
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
                onSave(formData as ResultadosRecord);
            } else {
                await api.addRecord('resultados', formData);
                addToast('Resultados operacionais submetidos com sucesso!', 'success');
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
            title={editingRecord ? "Editar Resultados Operacionais" : "Registo de Resultados Operacionais"}
            description="Preencha os detalhes abaixo para registar novos resultados operacionais."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Detalhes da Operação" defaultOpen>
                    <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" value={formData.data || ''} onChange={handleChange} required /></div>
                            <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo" value={formData.periodo || ''} onChange={handleChange} required><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                            <div><Label htmlFor="tipoOperacao">Tipo de Operação</Label><Input id="tipoOperacao" name="tipoOperacao" type="text" value={formData.tipoOperacao || ''} onChange={handleChange} /></div>
                            <div><Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label><Select id="unidadeEsquadra" name="unidadeEsquadra" value={formData.unidadeEsquadra || ''} onChange={handleChange} required><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                            <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange} required><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
                            <div><Label htmlFor="local">Local Específico</Label><Input id="local" name="local" type="text" value={formData.local || ''} onChange={handleChange} /></div>
                        </div>
                        <div><Label htmlFor="objetivo">Objetivo da Operação</Label><Textarea id="objetivo" name="objetivo" value={formData.objetivo || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="resultadosObtidos">Resultados Obtidos</Label><Textarea id="resultadosObtidos" name="resultadosObtidos" value={formData.resultadosObtidos || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Detalhes do Patrulhamento">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                         <div>
                            <Label htmlFor="tipoPatrulhamento">Tipo de Patrulhamento</Label>
                            <Select id="tipoPatrulhamento" name="tipoPatrulhamento" value={formData.tipoPatrulhamento || ''} onChange={handleChange}>
                                <option value="">Selecione o tipo</option>
                                <option value="Apeado">Apeado</option>
                                <option value="Auto">Auto</option>
                                <option value="Misto">Misto</option>
                            </Select>
                        </div>
                        <div><Label htmlFor="areaPatrulhada">Área Patrulhada</Label><Input id="areaPatrulhada" name="areaPatrulhada" type="text" value={formData.areaPatrulhada || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-2">
                            <Label htmlFor="ocorrenciasRegistadas">Ocorrências Registadas</Label>
                            <Textarea id="ocorrenciasRegistadas" name="ocorrenciasRegistadas" value={formData.ocorrenciasRegistadas || ''} onChange={handleChange} />
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Informação do Detido">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="detidoNome">Nome do Detido</Label><Input id="detidoNome" name="detidoNome" type="text" value={formData.detidoNome || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="detidoIdade">Idade</Label><Input id="detidoIdade" name="detidoIdade" type="number" value={formData.detidoIdade || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label htmlFor="motivoDetencao">Motivo da Detenção</Label><Input id="motivoDetencao" name="motivoDetencao" type="text" value={formData.motivoDetencao || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Outras Informações">
                    <div className="mt-4">
                        <Label htmlFor="observacoesGerais" className="sr-only">Observações Gerais</Label>
                        <Textarea id="observacoesGerais" name="observacoesGerais" value={formData.observacoesGerais || ''} onChange={handleChange} placeholder="Adicione aqui outras informações relevantes, como apreensões, etc." />
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default ResultadosForm;