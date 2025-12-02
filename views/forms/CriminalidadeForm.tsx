import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS, FAMILIAS_CRIMINAIS, CRIMES_POR_FAMILIA, TODOS_OS_CRIMES } from '../../constants';
import { FamíliaCriminal } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { OcorrenciaIcon, CrimeIcon, MoreIcon } from '../../components/icons/Icon';

const menuItems = [
    { name: 'Ocorrência', icon: <OcorrenciaIcon /> },
    { name: 'Crimes', icon: <CrimeIcon /> },
    { name: 'Outros', icon: <MoreIcon /> }
];

const CriminalidadeForm: React.FC = React.memo(() => {
    const [formData, setFormData] = useState<any>({
        familiaCriminal: '',
        crime: '',
    });
    const [crimes, setCrimes] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeMenu, setActiveMenu] = useState('Ocorrência');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (formData.familiaCriminal) {
            const familyKey = formData.familiaCriminal as FamíliaCriminal;
            setCrimes(CRIMES_POR_FAMILIA[familyKey] || []);
            setFormData(prev => ({ ...prev, crime: '' }));
        } else {
            setCrimes([]);
        }
    }, [formData.familiaCriminal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (activeMenu === 'Ocorrência') {
            if (!formData.data) newErrors.data = 'Data é obrigatória.';
            if (!formData.municipio) newErrors.municipio = 'Município é obrigatório.';
        }
        if (activeMenu === 'Crimes') {
            if (!formData.familiaCriminal) newErrors.familiaCriminal = 'Família Criminal é obrigatória.';
            if (!formData.crime) newErrors.crime = 'Crime é obrigatório.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        // Basic validation for current tab
        if (!validateForm()) {
            addToast('Por favor, preencha os campos obrigatórios.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const formElementData = new FormData(form);
            const data = Object.fromEntries(formElementData.entries());
            data.categoria = activeMenu;
            await api.addRecord('criminalidade', data);

            addToast(`Dados de criminalidade (${activeMenu}) submetidos com sucesso!`, 'success');
            triggerRefresh();
            form.reset();
            setFormData({ familiaCriminal: '', crime: '' });
            setActiveMenu('Ocorrência');
            setErrors({});
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const OcorrenciaTab = () => (
        <div className="space-y-6 animate-fade-in">
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Localização e Tempo</legend>
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" onChange={handleChange} required /><p className="text-red-500 text-xs mt-1">{errors.data}</p></div>
                    <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo"><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                    <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" onChange={handleChange} required><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select><p className="text-red-500 text-xs mt-1">{errors.municipio}</p></div>
                    <div><Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label><Select id="unidadeEsquadra" name="unidadeEsquadra"><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                    <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" name="comuna" type="text" /></div>
                    <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" type="text" /></div>
                    <div><Label htmlFor="rua">Rua</Label><Input id="rua" name="rua" type="text" /></div>
                    <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" /></div>
                    <div><Label htmlFor="pontoReferencia">Ponto de Referência</Label><Input id="pontoReferencia" name="pontoReferencia" type="text" /></div>
                </div>
            </fieldset>
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Dados da Vítima</legend>
                <div className="grid grid-cols-4 gap-6 mt-4">
                    <div><Label htmlFor="vitimaNome">Nome</Label><Input id="vitimaNome" name="vitimaNome" type="text" /></div>
                    <div><Label htmlFor="vitimaNacionalidade">Nacionalidade</Label><Input id="vitimaNacionalidade" name="vitimaNacionalidade" type="text" /></div>
                    <div><Label htmlFor="vitimaIdade">Idade</Label><Input id="vitimaIdade" name="vitimaIdade" type="number" /></div>
                    <div><Label htmlFor="vitimaEstadoCivil">Estado Civil</Label><Input id="vitimaEstadoCivil" name="vitimaEstadoCivil" type="text" /></div>
                </div>
            </fieldset>
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Dados do Acusado</legend>
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div><Label htmlFor="acusadoNome">Nome</Label><Input id="acusadoNome" name="acusadoNome" type="text" /></div>
                    <div><Label htmlFor="acusadoNacionalidade">Nacionalidade</Label><Input id="acusadoNacionalidade" name="acusadoNacionalidade" type="text" /></div>
                    <div><Label htmlFor="acusadoTCP">TCP</Label><Input id="acusadoTCP" name="acusadoTCP" type="text" /></div>
                    <div><Label htmlFor="acusadoIdade">Idade</Label><Input id="acusadoIdade" name="acusadoIdade" type="number" /></div>
                    <div><Label htmlFor="acusadoEstadoCivil">Estado Civil</Label><Input id="acusadoEstadoCivil" name="acusadoEstadoCivil" type="text" /></div>
                    <div><Label htmlFor="acusadoSituacaoPrisional">Situação Prisional</Label><Input id="acusadoSituacaoPrisional" name="acusadoSituacaoPrisional" type="text" /></div>
                </div>
            </fieldset>
        </div>
    );

    const CrimesTab = () => (
        <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Dados das Ocorrências</legend>
            <div className="grid grid-cols-3 gap-6 mt-4">
                <div className="lg:col-span-1">
                    <Label htmlFor="familiaCriminal">Família Criminal</Label>
                    <Select id="familiaCriminal" name="familiaCriminal" value={formData.familiaCriminal} onChange={handleChange} required><option value="">Selecione a Família</option>{FAMILIAS_CRIMINAIS.map(f => <option key={f} value={f}>{f}</option>)}</Select>
                    {errors.familiaCriminal && <p className="text-red-500 text-xs mt-1">{errors.familiaCriminal}</p>}
                </div>
                <div className="lg:col-span-1">
                    <Label htmlFor="crime">Crime</Label>
                    <Select id="crime" name="crime" value={formData.crime} onChange={handleChange} disabled={!formData.familiaCriminal} required><option value="">Selecione o Crime</option>{crimes.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                    {errors.crime && <p className="text-red-500 text-xs mt-1">{errors.crime}</p>}
                </div>
                <div><Label htmlFor="tipoCrime">Tipo de Crime</Label><Input id="tipoCrime" name="tipoCrime" type="text" /></div>
                <div className="col-span-3">
                    <Label htmlFor="todosCrimes">Tipificação (lista geral)</Label>
                    <Select id="todosCrimes" name="todosCrimes"><option value="">Selecione um crime da lista geral</option>{TODOS_OS_CRIMES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                </div>
                <div><Label htmlFor="modusOperandi">Modus Operandi</Label><Input id="modusOperandi" name="modusOperandi" type="text" /></div>
                <div><Label htmlFor="mobilDoCrime">Móbil do Crime</Label><Input id="mobilDoCrime" name="mobilDoCrime" type="text" /></div>
                <div><Label htmlFor="objetoUsado">Objeto Usado</Label><Input id="objetoUsado" name="objetoUsado" type="text" /></div>
                <div><Label htmlFor="descricaoDoObjeto">Descrição do Objeto</Label><Input id="descricaoDoObjeto" name="descricaoDoObjeto" type="text" /></div>
                <div><Label htmlFor="relacaoVitima">Relação com Vítima</Label><Input id="relacaoVitima" name="relacaoVitima" type="text" /></div>
                <div><Label htmlFor="estado">Estado</Label><Input id="estado" name="estado" type="text" /></div>
                <div><Label htmlFor="bensSubtraidos">Bens Subtraídos</Label><Input id="bensSubtraidos" name="bensSubtraidos" type="text" /></div>
                <div><Label htmlFor="situacaoDosBens">Situação dos bens</Label><Input id="situacaoDosBens" name="situacaoDosBens" type="text" /></div>
            </div>
        </fieldset>
    );
    
    const OutrosTab = () => (
         <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Descrição da Ocorrência</legend>
            <div className="mt-4">
                <Label htmlFor="descricaoOcorrencia" className="sr-only">Descrição da Ocorrência</Label>
                <Textarea id="descricaoOcorrencia" name="descricaoOcorrencia" placeholder="Descreva detalhadamente a ocorrência..." />
            </div>
        </fieldset>
    );

    return (
        <FormWrapper
            title="Registo de Criminalidade"
            description="Preencha os detalhes abaixo para registar uma nova ocorrência de criminalidade."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {menuItems.map(item => (
                        <button
                            key={item.name}
                            type="button"
                            onClick={() => setActiveMenu(item.name)}
                            className={`${
                                activeMenu === item.name
                                    ? 'border-custom-blue-500 text-custom-blue-600 dark:text-custom-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            } flex items-center whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm focus:outline-none`}
                        >
                            {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-2' })}
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="space-y-6">
                {activeMenu === 'Ocorrência' && <OcorrenciaTab />}
                {activeMenu === 'Crimes' && <CrimesTab />}
                {activeMenu === 'Outros' && <OutrosTab />}
            </div>
        </FormWrapper>
    );
});

export default CriminalidadeForm;