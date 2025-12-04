import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TransportesRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<TransportesRecord> = {
    tipoRegisto: 'Abastecimento',
    data: '',
};

interface TransportesFormProps {
    editingRecord?: TransportesRecord | null;
    onSave?: (record: TransportesRecord) => void;
    onCancel?: () => void;
}

const TransportesForm: React.FC<TransportesFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<TransportesRecord>>(initialFormData);
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
        const finalValue = type === 'number' ? parseFloat(value) || '' : value;
        
        const updatedState = { ...formData, [name]: finalValue };

        if (name === 'tipoRegisto') {
            const commonFields = { tipoRegisto: finalValue as any, data: updatedState.data };
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
                onSave(formData as TransportesRecord);
            } else {
                await api.addRecord('transportes', formData);
                addToast('Registo de transportes submetido com sucesso!', 'success');
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

    const renderDynamicFields = () => {
        switch(formData.tipoRegisto) {
            case 'Abastecimento':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div><Label htmlFor="viaturaMatricula">Matrícula da Viatura</Label><Input id="viaturaMatricula" name="viaturaMatricula" type="text" value={formData.viaturaMatricula || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="combustivel">Combustível</Label><Select id="combustivel" name="combustivel" value={formData.combustivel || ''} onChange={handleChange}><option value="">Selecione</option><option value="Gasolina">Gasolina</option><option value="Gasóleo">Gasóleo</option></Select></div>
                        <div><Label htmlFor="quantidadeLitros">Quantidade (Litros)</Label><Input id="quantidadeLitros" name="quantidadeLitros" type="number" value={formData.quantidadeLitros || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="bombaCombustivel">Bomba de Combustível</Label><Input id="bombaCombustivel" name="bombaCombustivel" type="text" value={formData.bombaCombustivel || ''} onChange={handleChange} /></div>
                    </div>
                );
            case 'Manutenção':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><Label htmlFor="viaturaMatricula">Matrícula da Viatura</Label><Input id="viaturaMatricula" name="viaturaMatricula" type="text" value={formData.viaturaMatricula || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="tipoManutencao">Tipo de Manutenção</Label><Select id="tipoManutencao" name="tipoManutencao" value={formData.tipoManutencao || ''} onChange={handleChange}><option value="">Selecione</option><option value="Preventiva">Preventiva</option><option value="Corretiva">Corretiva</option></Select></div>
                        <div><Label htmlFor="custoManutencao">Custo (AOA)</Label><Input id="custoManutencao" name="custoManutencao" type="number" value={formData.custoManutencao || ''} onChange={handleChange}/></div>
                        <div className="md:col-span-3"><Label htmlFor="descricaoServico">Descrição do Serviço</Label><Textarea id="descricaoServico" name="descricaoServico" value={formData.descricaoServico || ''} onChange={handleChange}/></div>
                    </div>
                );
            case 'Movimento de Pessoal':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div><Label htmlFor="nipEfetivo">NIP do Efetivo</Label><Input id="nipEfetivo" name="nipEfetivo" type="text" value={formData.nipEfetivo || ''} onChange={handleChange} /></div>
                        <div className="lg:col-span-3"><Label htmlFor="nomeEfetivo">Nome do Efetivo</Label><Input id="nomeEfetivo" name="nomeEfetivo" type="text" value={formData.nomeEfetivo || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="tipoMovimento">Tipo de Movimento</Label><Select id="tipoMovimento" name="tipoMovimento" value={formData.tipoMovimento || ''} onChange={handleChange}><option value="">Selecione</option><option value="Transferência">Transferência</option><option value="Férias">Férias</option><option value="Baixa Médica">Baixa Médica</option></Select></div>
                        <div><Label htmlFor="origem">Origem</Label><Input id="origem" name="origem" type="text" value={formData.origem || ''} onChange={handleChange}/></div>
                        <div className="lg:col-span-2"><Label htmlFor="destino">Destino</Label><Input id="destino" name="destino" type="text" value={formData.destino || ''} onChange={handleChange}/></div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <FormWrapper
            title={editingRecord ? "Editar Registo de Transportes" : "Registo de Transportes"}
            description="Selecione o tipo de registo e preencha os detalhes."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                 <CollapsibleSection title="Tipo de Registo e Data" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="md:col-span-1"><Label htmlFor="tipoRegisto">Tipo de Registo</Label><Select id="tipoRegisto" name="tipoRegisto" value={formData.tipoRegisto || ''} onChange={handleChange} required><option value="Abastecimento">Abastecimento</option><option value="Manutenção">Manutenção</option><option value="Movimento de Pessoal">Movimento de Pessoal</option></Select></div>
                        <div className="md:col-span-2"><Label htmlFor="data">Data do Registo</Label><Input id="data" name="data" type="datetime-local" value={formData.data || ''} onChange={handleChange} required /></div>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Detalhes do Registo" defaultOpen>
                    <div className="mt-4">
                      {renderDynamicFields()}
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default TransportesForm;