import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS, FAMILIAS_CRIMINAIS, CRIMES_POR_FAMILIA, TODOS_OS_CRIMES } from '../../constants';
import { FamíliaCriminal, CriminalidadeRecord } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<CriminalidadeRecord> = {
    familiaCriminal: undefined,
    crime: '',
    data: '',
    municipio: '',
};

interface CriminalidadeFormProps {
    editingRecord?: CriminalidadeRecord | null;
    onSave?: (record: CriminalidadeRecord) => void;
    onCancel?: () => void;
}

const CriminalidadeForm: React.FC<CriminalidadeFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<CriminalidadeRecord>>(initialFormData);
    const [crimes, setCrimes] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
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
            if (!editingRecord) { // Avoid resetting crime on initial load of edit form
              setFormData(prev => ({ ...prev, crime: '' }));
            }
        } else {
            setCrimes([]);
        }
    }, [formData.familiaCriminal, editingRecord]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.data) newErrors.data = 'Data é obrigatória.';
        if (!formData.municipio) newErrors.municipio = 'Município é obrigatório.';
        if (!formData.familiaCriminal) newErrors.familiaCriminal = 'Família Criminal é obrigatória.';
        if (!formData.crime) newErrors.crime = 'Crime é obrigatório.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            addToast('Por favor, preencha os campos obrigatórios.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (onSave) {
                 onSave(formData as CriminalidadeRecord);
            } else {
                await api.addRecord('criminalidade', formData);
                addToast('Ocorrência de criminalidade submetida com sucesso!', 'success');
                triggerRefresh();
                setFormData(initialFormData);
                setErrors({});
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
            description="Preencha os detalhes abaixo para registar uma nova ocorrência de criminalidade."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Localização e Tempo" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" value={formData.data || ''} onChange={handleChange} required error={!!errors.data} /><p className="text-red-500 text-xs mt-1">{errors.data}</p></div>
                        <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo" value={formData.periodo || ''} onChange={handleChange}><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                        <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" value={formData.municipio || ''} onChange={handleChange} required error={!!errors.municipio}><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select><p className="text-red-500 text-xs mt-1">{errors.municipio}</p></div>
                        <div><Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label><Select id="unidadeEsquadra" name="unidadeEsquadra" value={formData.unidadeEsquadra || ''} onChange={handleChange}><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                        <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" name="comuna" type="text" value={formData.comuna || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" type="text" value={formData.bairro || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="rua">Rua</Label><Input id="rua" name="rua" type="text" value={formData.rua || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" value={formData.local || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="pontoReferencia">Ponto de Referência</Label><Input id="pontoReferencia" name="pontoReferencia" type="text" value={formData.pontoReferencia || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Dados da Vítima">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="vitimaNome">Nome</Label><Input id="vitimaNome" name="vitimaNome" type="text" value={formData.vitimaNome || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="vitimaNacionalidade">Nacionalidade</Label><Input id="vitimaNacionalidade" name="vitimaNacionalidade" type="text" value={formData.vitimaNacionalidade || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="vitimaIdade">Idade</Label><Input id="vitimaIdade" name="vitimaIdade" type="number" value={formData.vitimaIdade || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="vitimaEstadoCivil">Estado Civil</Label><Input id="vitimaEstadoCivil" name="vitimaEstadoCivil" type="text" value={formData.vitimaEstadoCivil || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Dados do Acusado">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="acusadoNome">Nome</Label><Input id="acusadoNome" name="acusadoNome" type="text" value={formData.acusadoNome || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="acusadoNacionalidade">Nacionalidade</Label><Input id="acusadoNacionalidade" name="acusadoNacionalidade" type="text" value={formData.acusadoNacionalidade || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="acusadoTCP">TCP</Label><Input id="acusadoTCP" name="acusadoTCP" type="text" value={formData.acusadoTCP || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="acusadoIdade">Idade</Label><Input id="acusadoIdade" name="acusadoIdade" type="number" value={formData.acusadoIdade || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="acusadoEstadoCivil">Estado Civil</Label><Input id="acusadoEstadoCivil" name="acusadoEstadoCivil" type="text" value={formData.acusadoEstadoCivil || ''} onChange={handleChange} /></div>
                        <div><Label htmlFor="acusadoSituacaoPrisional">Situação Prisional</Label><Input id="acusadoSituacaoPrisional" name="acusadoSituacaoPrisional" type="text" value={formData.acusadoSituacaoPrisional || ''} onChange={handleChange} /></div>
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Dados da Ocorrência" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="lg:col-span-1">
                            <Label htmlFor="familiaCriminal">Família Criminal</Label>
                            <Select id="familiaCriminal" name="familiaCriminal" value={formData.familiaCriminal || ''} onChange={handleChange} required error={!!errors.familiaCriminal}><option value="">Selecione a Família</option>{FAMILIAS_CRIMINAIS.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                            {errors.familiaCriminal && <p className="text-red-500 text-xs mt-1">{errors.familiaCriminal}</p>}
                        </div>
                        <div className="lg:col-span-1">
                            <Label htmlFor="crime">Crime</Label>
                            <Select id="crime" name="crime" value={formData.crime || ''} onChange={handleChange} disabled={!formData.familiaCriminal} required error={!!errors.crime}><option value="">Selecione o Crime</option>{crimes.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                            {errors.crime && <p className="text-red-500 text-xs mt-1">{errors.crime}</p>}
                        </div>
                        <div><Label htmlFor="tipoCrime">Tipo de Crime</Label><Input id="tipoCrime" name="tipoCrime" type="text" value={formData.tipoCrime || ''} onChange={handleChange}/></div>
                        <div className="col-span-3">
                            <Label htmlFor="todosCrimes">Tipificação (lista geral)</Label>
                            <Select id="todosCrimes" name="todosCrimes" value={formData.todosCrimes || ''} onChange={handleChange}><option value="">Selecione um crime da lista geral</option>{TODOS_OS_CRIMES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                        </div>
                        <div><Label htmlFor="modusOperandi">Modus Operandi</Label><Input id="modusOperandi" name="modusOperandi" type="text" value={formData.modusOperandi || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="mobilDoCrime">Móbil do Crime</Label><Input id="mobilDoCrime" name="mobilDoCrime" type="text" value={formData.mobilDoCrime || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="objetoUsado">Objeto Usado</Label><Input id="objetoUsado" name="objetoUsado" type="text" value={formData.objetoUsado || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="descricaoDoObjeto">Descrição do Objeto</Label><Input id="descricaoDoObjeto" name="descricaoDoObjeto" type="text" value={formData.descricaoDoObjeto || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="relacaoVitima">Relação com Vítima</Label><Input id="relacaoVitima" name="relacaoVitima" type="text" value={formData.relacaoVitima || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="estado">Estado</Label><Input id="estado" name="estado" type="text" value={formData.estado || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="bensSubtraidos">Bens Subtraídos</Label><Input id="bensSubtraidos" name="bensSubtraidos" type="text" value={formData.bensSubtraidos || ''} onChange={handleChange}/></div>
                        <div><Label htmlFor="situacaoDosBens">Situação dos bens</Label><Input id="situacaoDosBens" name="situacaoDosBens" type="text" value={formData.situacaoDosBens || ''} onChange={handleChange}/></div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Descrição Detalhada da Ocorrência">
                    <div className="mt-4">
                        <Label htmlFor="descricaoOcorrencia" className="sr-only">Descrição da Ocorrência</Label>
                        <Textarea id="descricaoOcorrencia" name="descricaoOcorrencia" value={formData.descricaoOcorrencia || ''} onChange={handleChange} placeholder="Descreva detalhadamente a ocorrência..." />
                    </div>
                </CollapsibleSection>
            </div>
        </FormWrapper>
    );
});

export default CriminalidadeForm;