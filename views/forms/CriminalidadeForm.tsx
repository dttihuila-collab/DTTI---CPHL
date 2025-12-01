
import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
// FIX: Corrected typo from FAMILIas_DELETIVAS to FAMILIAS_DELETIVAS
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS, FAMILIAS_DELETIVAS, CRIMES_POR_FAMILIA } from '../../constants';
import { CrimeFamily } from '../../types';
import { api } from '../../services/api';

const CriminalidadeForm: React.FC = () => {
    const [formData, setFormData] = useState({
        familiaDeletiva: '',
        crime: '',
    });
    const [crimes, setCrimes] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (formData.familiaDeletiva) {
            const familyKey = formData.familiaDeletiva as CrimeFamily;
            setCrimes(CRIMES_POR_FAMILIA[familyKey] || []);
            setFormData(prev => ({ ...prev, crime: '' }));
        } else {
            setCrimes([]);
        }
    }, [formData.familiaDeletiva]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.familiaDeletiva) newErrors.familiaDeletiva = 'Família Deletiva é obrigatória.';
        // Add more validations here for other fields
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (validateForm()) {
            const formElementData = new FormData(form);
            const data = Object.fromEntries(formElementData.entries());
            await api.addRecord('criminalidade', data);

            setSuccessMessage('Dados de criminalidade submetidos com sucesso!');
            form.reset();
            setFormData({ familiaDeletiva: '', crime: '' });
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    return (
        <FormWrapper
            title="Registo de Criminalidade"
            description="Preencha os detalhes abaixo para registar uma nova ocorrência de criminalidade."
            onSubmit={handleSubmit}
        >
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
            
            <div className="space-y-6">
                 <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Localização e Tempo</legend>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" /></div>
                        <div>
                            <Label htmlFor="periodo">Período</Label>
                            <Select id="periodo" name="periodo"><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                        </div>
                        <div>
                            <Label htmlFor="municipio">Município</Label>
                            <Select id="municipio" name="municipio"><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select>
                        </div>
                         <div>
                            <Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label>
                            <Select id="unidadeEsquadra" name="unidadeEsquadra"><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select>
                        </div>
                        <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" name="comuna" type="text" /></div>
                        <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" type="text" /></div>
                        <div><Label htmlFor="rua">Rua</Label><Input id="rua" name="rua" type="text" /></div>
                        <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" /></div>
                        <div><Label htmlFor="pontoReferencia">Ponto de Referência</Label><Input id="pontoReferencia" name="pontoReferencia" type="text" /></div>
                    </div>
                </fieldset>
                
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Dados das Ocorrências</legend>
                     <div className="grid grid-cols-3 gap-6 mt-4">
                        <div className="lg:col-span-1">
                            <Label htmlFor="familiaDeletiva">Família Deletiva</Label>
                            {/* FIX: Corrected typo from FAMILIas_DELETIVAS to FAMILIAS_DELETIVAS. This fix is consequential to the import fix. */}
                            <Select id="familiaDeletiva" name="familiaDeletiva" value={formData.familiaDeletiva} onChange={handleChange}><option value="">Selecione a Família</option>{FAMILIAS_DELETIVAS.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                            {errors.familiaDeletiva && <p className="text-red-500 text-xs mt-1">{errors.familiaDeletiva}</p>}
                        </div>
                        <div className="lg:col-span-1">
                            <Label htmlFor="crime">Crime</Label>
                            <Select id="crime" name="crime" value={formData.crime} onChange={handleChange} disabled={!formData.familiaDeletiva}><option value="">Selecione o Crime</option>{crimes.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                        </div>
                        <div><Label htmlFor="tipoCrime">Tipo de Crime</Label><Input id="tipoCrime" name="tipoCrime" type="text" /></div>
                        <div><Label htmlFor="modusOperandi">Modus Operandi</Label><Input id="modusOperandi" name="modusOperandi" type="text" /></div>
                        <div><Label htmlFor="mobilCrime">Mobil Crime</Label><Input id="mobilCrime" name="mobilCrime" type="text" /></div>
                        <div><Label htmlFor="objectoUsado">Objecto Usado</Label><Input id="objectoUsado" name="objectoUsado" type="text" /></div>
                        <div><Label htmlFor="descricaoObjecto">Descrição do Objecto</Label><Input id="descricaoObjecto" name="descricaoObjecto" type="text" /></div>
                        <div><Label htmlFor="relacaoVitima">Relação com Vítima</Label><Input id="relacaoVitima" name="relacaoVitima" type="text" /></div>
                        <div><Label htmlFor="estado">Estado</Label><Input id="estado" name="estado" type="text" /></div>
                        <div><Label htmlFor="meiosSubtraidos">Meios Subtraídos</Label><Input id="meiosSubtraidos" name="meiosSubtraidos" type="text" /></div>
                        <div><Label htmlFor="situacaoMeios">Situação dos meios</Label><Input id="situacaoMeios" name="situacaoMeios" type="text" /></div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Dados da Vítima</legend>
                    <div className="grid grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="vitimaNome">Nome</Label><Input id="vitimaNome" name="vitimaNome" type="text" /></div>
                        <div><Label htmlFor="vitimaNacionalidade">Nacionalidade</Label><Input id="vitimaNacionalidade" name="vitimaNacionalidade" type="text" /></div>
                        <div><Label htmlFor="vitimaIdade">Idade</Label><Input id="vitimaIdade" name="vitimaIdade" type="number" /></div>
                        <div><Label htmlFor="vitimaEstadoCivil">Estado Civil</Label><Input id="vitimaEstadoCivil" name="vitimaEstadoCivil" type="text" /></div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Dados do Acusado</legend>
                    <div className="grid grid-cols-3 gap-6 mt-4">
                        <div><Label htmlFor="acusadoNome">Nome</Label><Input id="acusadoNome" name="acusadoNome" type="text" /></div>
                        <div><Label htmlFor="acusadoNacionalidade">Nacionalidade</Label><Input id="acusadoNacionalidade" name="acusadoNacionalidade" type="text" /></div>
                        <div><Label htmlFor="acusadoTCP">TCP</Label><Input id="acusadoTCP" name="acusadoTCP" type="text" /></div>
                        <div><Label htmlFor="acusadoIdade">Idade</Label><Input id="acusadoIdade" name="acusadoIdade" type="number" /></div>
                        <div><Label htmlFor="acusadoEstadoCivil">Estado Cívil</Label><Input id="acusadoEstadoCivil" name="acusadoEstadoCivil" type="text" /></div>
                        <div><Label htmlFor="acusadoSituacaoCarceraria">Situação Carcerária</Label><Input id="acusadoSituacaoCarceraria" name="acusadoSituacaoCarceraria" type="text" /></div>
                    </div>
                </fieldset>
                
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Descrição da Ocorrência</legend>
                    <div className="mt-4">
                        <Label htmlFor="descricaoOcorrencia" className="sr-only">Descrição da Ocorrência</Label>
                        <Textarea id="descricaoOcorrencia" name="descricaoOcorrencia" placeholder="Descreva detalhadamente a ocorrência..." />
                    </div>
                </fieldset>
            </div>
        </FormWrapper>
    );
};

export default CriminalidadeForm;