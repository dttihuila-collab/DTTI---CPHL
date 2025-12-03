import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, PATENTES } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TransportesRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<TransportesRecord> = {};

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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (onSave) {
                onSave(formData as TransportesRecord);
            } else {
                await api.addRecord('transportes', formData);
                addToast('Dados de transportes submetidos com sucesso!', 'success');
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
            title={editingRecord ? "Editar Registo de Transportes" : "Registo de Transportes"}
            description="Registe informações sobre combustíveis, pessoal e manutenções."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Plano de Distribuição de Combustível" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <Label htmlFor="combustivel">Combustível</Label>
                            <Select id="combustivel" name="combustivel" value={formData.combustivel || ''} onChange={handleChange}><option value="">Selecione o Combustível</option><option value="Gasolina">Gasolina</option><option value="Gasóleo">Gasóleo</option></Select>
                        </div>
                        <div><Label htmlFor="quantidade">Quantidade Total (Litros)</Label><Input id="quantidade" name="quantidade" type="number" value={formData.quantidade || ''} onChange={handleChange}/></div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange}><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
                        <div><Label htmlFor="quantidadeRecebida">Quantidade Distribuída</Label><Input id="quantidadeRecebida" name="quantidadeRecebida" type="number" value={formData.quantidadeRecebida || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="existencia">Existência Atual</Label><Input id="existencia" name="existencia" type="number" value={formData.existencia || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Registo de Pessoal (Membros)">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" type="text" value={formData.nome || ''} onChange={handleChange}/></div>
                        <div>
                            <Label htmlFor="patente">Patente</Label>
                            <Select id="patente" name="patente" value={formData.patente || ''} onChange={handleChange}>
                                <option value="">Selecione a Patente</option>
                                {PATENTES.map(p => <option key={p} value={p}>{p}</option>)}
                            </Select>
                        </div>
                        <div><Label htmlFor="area">Área</Label><Input id="area" name="area" type="text" value={formData.area || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="quantidadeRecebidaPessoal">Quantidade Recebida</Label><Input id="quantidadeRecebidaPessoal" name="quantidadeRecebidaPessoal" type="number" value={formData.quantidadeRecebidaPessoal || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Registo de Manutenção de Viaturas">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="viaturaMatricula">Viatura (Matrícula)</Label><Input id="viaturaMatricula" name="viaturaMatricula" type="text" value={formData.viaturaMatricula || ''} onChange={handleChange}/></div>
                        <div>
                            <Label htmlFor="tipoManutencao">Tipo de Manutenção</Label>
                            <Select id="tipoManutencao" name="tipoManutencao" value={formData.tipoManutencao || ''} onChange={handleChange}><option value="">Selecione o tipo</option><option value="Preventiva">Preventiva</option><option value="Corretiva">Corretiva</option></Select>
                        </div>
                        <div><Label htmlFor="custoManutencao">Custo (AOA)</Label><Input id="custoManutencao" name="custoManutencao" type="number" value={formData.custoManutencao || ''} onChange={handleChange}/></div>
                        <div className="md:col-span-3"><Label htmlFor="descManutencao">Descrição do Serviço</Label><Textarea id="descManutencao" name="descManutencao" value={formData.descManutencao || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Observações Gerais">
                     <div className="mt-4">
                        <Label htmlFor="obsGerais" className="sr-only">Observações Gerais</Label>
                        <Textarea id="obsGerais" name="obsGerais" value={formData.obsGerais || ''} onChange={handleChange} placeholder="Adicione aqui outras informações relevantes..." />
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default TransportesForm;