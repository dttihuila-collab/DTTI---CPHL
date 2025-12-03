import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select } from '../../components/common/FormElements';
import { TIPOS_VESTUARIO, PATENTES, ORGAOS_UNIDADES } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { LogisticaRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<LogisticaRecord> = {};

interface LogisticaFormProps {
    editingRecord?: LogisticaRecord | null;
    onSave?: (record: LogisticaRecord) => void;
    onCancel?: () => void;
}

const LogisticaForm: React.FC<LogisticaFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<LogisticaRecord>>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [efectivos, setEfectivos] = useState<{ nip: string, nome: string }[]>([]);
    const { addToast } = useToast();
    const { triggerRefresh, refreshKey } = useDataRefresh();

    useEffect(() => {
        if (editingRecord) {
            setFormData(editingRecord);
        } else {
            setFormData(initialFormData);
        }
    }, [editingRecord]);

    useEffect(() => {
        const fetchEfectivos = async () => {
            try {
                const records = await api.getRecords('logistica');
                const efectivosData = records.map(r => ({
                    nip: r.nip,
                    nome: r.nomeCompleto,
                })).filter(e => e.nip && e.nome); 
                setEfectivos(efectivosData);
            } catch (error) {
                console.error("Failed to fetch efectivos", error);
                addToast('Falha ao carregar lista de efectivos.', 'error');
            }
        };
        fetchEfectivos();
    }, [addToast, refreshKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
             if (onSave) {
                onSave(formData as LogisticaRecord);
            } else {
                await api.addRecord('logistica', formData);
                addToast('Dados de logística submetidos com sucesso!', 'success');
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
            title={editingRecord ? "Editar Registo de Logística" : "Registo de Meios Logísticos"}
            description="Registe e organize os meios logísticos disponíveis."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Registo de Ficha de Agente" defaultOpen>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1"><Label htmlFor="numFicha">Nº da Ficha</Label><Input id="numFicha" name="numFicha" type="text" value={formData.numFicha || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label htmlFor="orgaoUnidade">Órgão/Unidade</Label><Select id="orgaoUnidade" name="orgaoUnidade" value={formData.orgaoUnidade || ''} onChange={handleChange}><option value="">Selecione</option>{ORGAOS_UNIDADES.map(o => <option key={o} value={o}>{o}</option>)}</Select></div>
                        
                        <div className="md:col-span-1"><Label htmlFor="nip">NIP</Label><Input id="nip" name="nip" type="text" value={formData.nip || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label htmlFor="patente">Patente</Label><Select id="patente" name="patente" value={formData.patente || ''} onChange={handleChange}><option value="">Selecione</option>{PATENTES.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                        
                        <div className="md:col-span-4"><Label htmlFor="nomeCompleto">Nome completo</Label><Input id="nomeCompleto" name="nomeCompleto" type="text" value={formData.nomeCompleto || ''} onChange={handleChange} /></div>
                        
                        <div className="md:col-span-2"><Label htmlFor="funcao">Função</Label><Input id="funcao" name="funcao" type="text" value={formData.funcao || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-2"><Label htmlFor="dataIncorporacao">Data de Incorporação</Label><Input id="dataIncorporacao" name="dataIncorporacao" type="date" value={formData.dataIncorporacao || ''} onChange={handleChange} /></div>

                        <div className="md:col-span-4"><Label htmlFor="localIngresso">Local de Ingresso</Label><Input id="localIngresso" name="localIngresso" type="text" value={formData.localIngresso || ''} onChange={handleChange} /></div>
                        
                        <div className="md:col-span-2"><Label htmlFor="dataAbertura">Data de Abertura</Label><Input id="dataAbertura" name="dataAbertura" type="date" value={formData.dataAbertura || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Registo de Vestuário">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><Label htmlFor="numRegisto">Nº de Registo</Label><Input id="numRegisto" name="numRegisto" type="text" value={formData.numRegisto || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-2">
                            <Label htmlFor="efectivoId">Nome do Efectivo</Label>
                            <Select id="efectivoId" name="efectivoId" value={formData.efectivoId || ''} onChange={handleChange}>
                                <option value="">Selecione o efectivo</option>
                                {efectivos.map(ef => (
                                    <option key={ef.nip} value={ef.nip}>
                                        {ef.nip} - {ef.nome}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="md:col-span-3">
                            <Label htmlFor="tipoFardamento">Tipo de Fardamento</Label>
                            <Select id="tipoFardamento" name="tipoFardamento" value={formData.tipoFardamento || ''} onChange={handleChange}>
                                <option value="">Selecione o tipo</option>
                                {TIPOS_VESTUARIO.map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 md:col-span-3">
                            <div><Label htmlFor="tamanhoBone">Tamanho do Boné</Label><Input id="tamanhoBone" name="tamanhoBone" type="number" value={formData.tamanhoBone || ''} onChange={handleChange} /></div>
                            <div><Label htmlFor="tamanhoBoina">Tamanho da Boina</Label><Input id="tamanhoBoina" name="tamanhoBoina" type="number" value={formData.tamanhoBoina || ''} onChange={handleChange} /></div>
                            <div><Label htmlFor="calcadoNum">Calçado Nº</Label><Input id="calcadoNum" name="calcadoNum" type="number" value={formData.calcadoNum || ''} onChange={handleChange} /></div>

                            <div><Label htmlFor="camisaNum">Camisa Nº</Label><Input id="camisaNum" name="camisaNum" type="number" value={formData.camisaNum || ''} onChange={handleChange} /></div>
                            <div><Label htmlFor="calcaNum">Calça Nº</Label><Input id="calcaNum" name="calcaNum" type="number" value={formData.calcaNum || ''} onChange={handleChange} /></div>
                            <div><Label htmlFor="casacoNum">Casaco Nº</Label><Input id="casacoNum" name="casacoNum" type="number" value={formData.casacoNum || ''} onChange={handleChange} /></div>
                        </div>

                        <div className="md:col-span-2"><Label htmlFor="atendente">Atendente</Label><Input id="atendente" name="atendente" type="text" value={formData.atendente || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="dataEntrega">Data de Entrega</Label><Input id="dataEntrega" name="dataEntrega" type="date" value={formData.dataEntrega || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default LogisticaForm;