import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TransportesRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import { TIPOS_VIATURA, ESTADOS_VIATURA } from '../../constants';

const initialFormData: Partial<TransportesRecord> = {
    data: '',
};

interface TransportesFormProps {
    initialData?: Partial<TransportesRecord> | null;
    editingRecord?: TransportesRecord | null;
    onSave?: (record: TransportesRecord) => void;
    onCancel?: () => void;
}

const TransportesForm: React.FC<TransportesFormProps> = React.memo(({ initialData, editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<TransportesRecord>>(initialFormData);
    const [veiculos, setVeiculos] = useState<TransportesRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        const fetchVeiculos = async () => {
            try {
                const allRecords = await api.getRecords('transportes');
                const veiculoRecords = allRecords.filter(r => r.tipoRegisto === 'Cadastro de Meio');
                setVeiculos(veiculoRecords);
            } catch (error) {
                addToast('Falha ao carregar a lista de veículos.', 'error');
            }
        };
        fetchVeiculos();
    }, []);

    useEffect(() => {
        if (editingRecord) {
            setFormData(editingRecord);
        } else if (initialData) {
            setFormData({ ...initialFormData, ...initialData });
        } else {
            setFormData({ ...initialFormData, tipoRegisto: 'Cadastro de Meio' });
        }
    }, [initialData, editingRecord]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) || '' : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (onSave) {
                onSave(formData as TransportesRecord);
            } else {
                await api.addRecord('transportes', formData);
                addToast(`Registo de '${formData.tipoRegisto}' submetido com sucesso!`, 'success');
                triggerRefresh();
                setFormData({ ...initialFormData, tipoRegisto: formData.tipoRegisto });
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
            case 'Cadastro de Meio':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div><Label htmlFor="matricula">Matrícula</Label><Input id="matricula" name="matricula" type="text" value={formData.matricula || ''} onChange={handleChange} required /></div>
                        <div><Label htmlFor="marca">Marca</Label><Input id="marca" name="marca" type="text" value={formData.marca || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="modelo">Modelo</Label><Input id="modelo" name="modelo" type="text" value={formData.modelo || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="tipoViatura">Tipo de Viatura</Label><Select id="tipoViatura" name="tipoViatura" value={formData.tipoViatura || ''} onChange={handleChange}><option value="">Selecione</option>{TIPOS_VIATURA.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
                        <div className="md:col-span-2"><Label htmlFor="estadoViatura">Estado da Viatura</Label><Select id="estadoViatura" name="estadoViatura" value={formData.estadoViatura || ''} onChange={handleChange}><option value="">Selecione</option>{ESTADOS_VIATURA.map(e => <option key={e} value={e}>{e}</option>)}</Select></div>
                    </div>
                );
            case 'Manutenção':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3"><Label htmlFor="viaturaMatricula">Viatura (Matrícula)</Label><Select id="viaturaMatricula" name="viaturaMatricula" value={formData.viaturaMatricula || ''} onChange={handleChange} required><option value="">Selecione uma viatura</option>{veiculos.map(v => <option key={v.id} value={v.matricula}>{v.matricula} ({v.marca} {v.modelo})</option>)}</Select></div>
                        <div><Label htmlFor="tipoManutencao">Tipo de Manutenção</Label><Select id="tipoManutencao" name="tipoManutencao" value={formData.tipoManutencao || ''} onChange={handleChange}><option value="">Selecione</option><option value="Preventiva">Preventiva</option><option value="Corretiva">Corretiva</option></Select></div>
                        <div className="md:col-span-2"><Label htmlFor="custoManutencao">Custo (AOA)</Label><Input id="custoManutencao" name="custoManutencao" type="number" value={formData.custoManutencao || ''} onChange={handleChange}/></div>
                        <div className="md:col-span-3"><Label htmlFor="descricaoServico">Descrição do Serviço</Label><Input id="descricaoServico" name="descricaoServico" value={formData.descricaoServico || ''} onChange={handleChange}/></div>
                    </div>
                );
            case 'Abastecimento':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2"><Label htmlFor="viaturaMatricula">Viatura (Matrícula)</Label><Select id="viaturaMatricula" name="viaturaMatricula" value={formData.viaturaMatricula || ''} onChange={handleChange} required><option value="">Selecione uma viatura</option>{veiculos.map(v => <option key={v.id} value={v.matricula}>{v.matricula} ({v.marca} {v.modelo})</option>)}</Select></div>
                        <div><Label htmlFor="combustivel">Combustível</Label><Select id="combustivel" name="combustivel" value={formData.combustivel || ''} onChange={handleChange}><option value="">Selecione</option><option value="Gasolina">Gasolina</option><option value="Gasóleo">Gasóleo</option></Select></div>
                        <div><Label htmlFor="quantidadeLitros">Quantidade (Litros)</Label><Input id="quantidadeLitros" name="quantidadeLitros" type="number" value={formData.quantidadeLitros || ''} onChange={handleChange}/></div>
                        <div className="lg:col-span-4"><Label htmlFor="bombaCombustivel">Bomba de Combustível</Label><Input id="bombaCombustivel" name="bombaCombustivel" type="text" value={formData.bombaCombustivel || ''} onChange={handleChange} /></div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <FormWrapper
            title={editingRecord ? `Editar Registo (${formData.tipoRegisto})` : `Registo de Transportes - ${formData.tipoRegisto}`}
            description="Preencha os detalhes do registo."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                 <CollapsibleSection title="Dados Gerais" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="md:col-span-1"><Label htmlFor="tipoRegisto">Tipo de Registo</Label><Select id="tipoRegisto" name="tipoRegisto" value={formData.tipoRegisto || ''} onChange={handleChange} required disabled><option value="Cadastro de Meio">Cadastro de Meio</option><option value="Manutenção">Manutenção</option><option value="Abastecimento">Abastecimento</option></Select></div>
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