

import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS, TIPOS_ACIDENTE } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { AccidentIcon, VictimIcon, MoreIcon } from '../../components/icons/Icon';

const menuItems = [
    { name: 'Acidentes', icon: <AccidentIcon /> },
    { name: 'Vítimas', icon: <VictimIcon /> },
    { name: 'Outros', icon: <MoreIcon /> },
];

const SinistralidadeForm: React.FC = React.memo(() => {
    const [activeMenu, setActiveMenu] = useState('Acidentes');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        setIsSubmitting(true);
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.categoria = activeMenu;
            await api.addRecord('sinistralidade', data);

            addToast(`Dados de sinistralidade (${activeMenu}) submetidos com sucesso!`, 'success');
            triggerRefresh();
            form.reset();
            setActiveMenu('Acidentes');
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const AcidentesTab = () => (
        <div className="space-y-6 animate-fade-in">
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Localização e Tempo</legend>
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" required /></div>
                    <div><Label htmlFor="periodo">Período</Label><Select id="periodo" name="periodo" required><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                    <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" required><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
                    <div><Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label><Select id="unidadeEsquadra" name="unidadeEsquadra" required><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                    <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" name="comuna" type="text" /></div>
                    <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" type="text" /></div>
                    <div><Label htmlFor="rua">Rua</Label><Input id="rua" name="rua" type="text" /></div>
                    <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" /></div>
                    <div><Label htmlFor="pontoReferencia">Ponto de Referência</Label><Input id="pontoReferencia" name="pontoReferencia" type="text" /></div>
                </div>
            </fieldset>
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Detalhes do Acidente</legend>
                <div className="grid grid-cols-1 gap-6 mt-4">
                    <div><Label htmlFor="tipoAcidente">Tipo de Acidente</Label><Select id="tipoAcidente" name="tipoAcidente" required><option value="">Selecione o tipo de acidente</option>{TIPOS_ACIDENTE.map(a => <option key={a} value={a}>{a}</option>)}</Select></div>
                </div>
            </fieldset>
        </div>
    );

    const VitimasTab = () => (
        <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Dados das Vítimas</legend>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                <div><Label htmlFor="vitimaNome">Nome</Label><Input id="vitimaNome" name="vitimaNome" type="text" /></div>
                <div><Label htmlFor="vitimaIdade">Idade</Label><Input id="vitimaIdade" name="vitimaIdade" type="number" /></div>
                 <div>
                    <Label htmlFor="vitimaEstado">Estado</Label>
                    <Select id="vitimaEstado" name="vitimaEstado">
                        <option value="">Selecione o estado</option>
                        <option value="Fatal">Fatal</option>
                        <option value="Grave">Grave</option>
                        <option value="Ligeiro">Ligeiro</option>
                        <option value="Ileso">Ileso</option>
                    </Select>
                </div>
                <div><Label htmlFor="vitimaVeiculo">Veículo</Label><Input id="vitimaVeiculo" name="vitimaVeiculo" type="text" /></div>
            </div>
        </fieldset>
    );

    const OutrosTab = () => (
        <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
           <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Observações</legend>
           <div className="mt-4">
               <Label htmlFor="observacoes" className="sr-only">Observações</Label>
               <Textarea id="observacoes" name="observacoes" placeholder="Adicione quaisquer observações ou detalhes adicionais..." />
           </div>
       </fieldset>
   );


    return (
        <FormWrapper
            title="Registo de Sinistralidade Rodoviária"
            description="Preencha os detalhes abaixo para registar uma nova ocorrência de sinistralidade."
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
                {activeMenu === 'Acidentes' && <AcidentesTab />}
                {activeMenu === 'Vítimas' && <VitimasTab />}
                {activeMenu === 'Outros' && <OutrosTab />}
            </div>
        </FormWrapper>
    );
});

export default SinistralidadeForm;