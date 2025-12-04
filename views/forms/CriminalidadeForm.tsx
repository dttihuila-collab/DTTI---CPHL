import React, { useState, useEffect, useMemo } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS, FAMILIAS_CRIMINAIS, CRIMES_POR_FAMILIA } from '../../constants';
import { FamíliaCriminal, CriminalidadeRecord } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import EditableSelect from '../../components/common/EditableSelect';

const initialFormData: Partial<CriminalidadeRecord> = {
    familiaCriminal: undefined,
    crime: '',
    dataOcorrencia: '',
    municipio: '',
    estadoProcesso: 'Em Investigação',
    situacaoAcusado: 'Desconhecido',
};

interface CriminalidadeFormProps {
    editingRecord?: CriminalidadeRecord | null;
    onSave?: (record: CriminalidadeRecord) => void;
    onCancel?: () => void;
}

const CriminalidadeForm: React.FC<CriminalidadeFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<CriminalidadeRecord>>(initialFormData);
    const [crimes, setCrimes] = useState<string[]>([]);
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

    useEffect(() => {
        if (formData.familiaCriminal) {
            const familyKey = formData.familiaCriminal as FamíliaCriminal;
            setCrimes(CRIMES_POR_FAMILIA[familyKey] || []);
            if (!editingRecord) {
              setFormData(prev => ({ ...prev, crime: '' }));
            }
        } else {
            setCrimes([]);
        }
    }, [formData.familiaCriminal, editingRecord]);

    const crimeStorageKey = useMemo(() => {
        if (!formData.familiaCriminal) return 'sccphl_custom_crimes_generico';
        const key = formData.familiaCriminal.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return `sccphl_custom_crimes_${key}`;
    }, [formData.familiaCriminal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (onSave) {
                 onSave(formData as CriminalidadeRecord);
            } else {
                await api.addRecord('criminalidade', formData);
                addToast('Ocorrência de criminalidade submetida com sucesso!', 'success');
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
            title={editingRecord ? "Editar Registo de Criminalidade" : "Registo de Criminalidade"}
            description="Preencha os detalhes da ocorrência de criminalidade."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Dados da Ocorrência" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="dataOcorrencia">Data e Hora</Label><Input id="dataOcorrencia" name="dataOcorrencia" type="datetime-local" value={formData.dataOcorrencia || ''} onChange={handleChange} required /></div>
                        <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo" value={formData.periodo || ''} onChange={handleChange}><option value="">Selecione</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                        <EditableSelect label="Município" id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange} options={MUNICIPIOS_HUILA} storageKey="sccphl_custom_municipios" required />
                        <EditableSelect label="Unidade/Esquadra" id="unidadeEsquadra" name="unidadeEsquadra" value={formData.unidadeEsquadra || ''} onChange={handleChange} options={UNIDADES_ESQUADRAS} storageKey="sccphl_custom_unidades_esquadras" />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Tipificação do Crime" defaultOpen>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div><Label htmlFor="familiaCriminal">Família Criminal</Label><Select id="familiaCriminal" name="familiaCriminal" value={formData.familiaCriminal || ''} onChange={handleChange} required><option value="">Selecione</option>{FAMILIAS_CRIMINAIS.map(f => <option key={f} value={f}>{f}</option>)}</Select></div>
                        <EditableSelect label="Crime" id="crime" name="crime" value={formData.crime || ''} onChange={handleChange} options={crimes} storageKey={crimeStorageKey} disabled={!formData.familiaCriminal} required />
                        <div className="md:col-span-2"><Label htmlFor="modusOperandi">Modus Operandi</Label><Input id="modusOperandi" name="modusOperandi" type="text" value={formData.modusOperandi || ''} onChange={handleChange}/></div>
                        <div className="md:col-span-2"><Label htmlFor="objetosUsados">Objetos Usados</Label><Input id="objetosUsados" name="objetosUsados" type="text" value={formData.objetosUsados || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Envolvidos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <fieldset className="border p-4 rounded-md dark:border-gray-600"><legend className="px-2 font-medium">Vítima</legend><div className="grid grid-cols-2 gap-4"><div className="col-span-2"><Label>Nome</Label><Input name="nomeVitima" value={formData.nomeVitima || ''} onChange={handleChange} /></div><div><Label>Idade</Label><Input name="idadeVitima" type="number" value={formData.idadeVitima || ''} onChange={handleChange} /></div></div></fieldset>
                        <fieldset className="border p-4 rounded-md dark:border-gray-600"><legend className="px-2 font-medium">Acusado</legend><div className="grid grid-cols-2 gap-4"><div className="col-span-2"><Label>Nome</Label><Input name="nomeAcusado" value={formData.nomeAcusado || ''} onChange={handleChange} /></div><div><Label>Idade</Label><Input name="idadeAcusado" type="number" value={formData.idadeAcusado || ''} onChange={handleChange} /></div><div><Label>Situação</Label><Select name="situacaoAcusado" value={formData.situacaoAcusado || ''} onChange={handleChange}><option value="Detido">Detido</option><option value="Foragido">Foragido</option><option value="Desconhecido">Desconhecido</option></Select></div></div></fieldset>
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Desfecho e Observações">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div><Label htmlFor="numeroProcesso">Nº do Processo Associado</Label><Input id="numeroProcesso" name="numeroProcesso" type="text" value={formData.numeroProcesso || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="estadoProcesso">Estado</Label><Select id="estadoProcesso" name="estadoProcesso" value={formData.estadoProcesso || ''} onChange={handleChange}><option value="Em Investigação">Em Investigação</option><option value="Remetido a Tribunal">Remetido a Tribunal</option><option value="Concluído">Concluído</option></Select></div>
                        <div className="md:col-span-2"><Label htmlFor="bensRecuperados">Bens Recuperados</Label><Input id="bensRecuperados" name="bensRecuperados" type="text" value={formData.bensRecuperados || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-2"><Label htmlFor="observacoes">Observações</Label><Textarea id="observacoes" name="observacoes" value={formData.observacoes || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default CriminalidadeForm;