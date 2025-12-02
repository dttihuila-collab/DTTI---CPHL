
import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS } from '../../constants';
import { api } from '../../services/api';

const menuItems = ['Operações', 'Patrulhamentos', 'Detidos', 'Outros'];

const ResultadosForm: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [activeMenu, setActiveMenu] = useState('Operações');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.categoria = activeMenu;
        await api.addRecord('resultados', data);

        setSuccessMessage(`Dados de resultados (${activeMenu}) submetidos com sucesso!`);
        form.reset();
        setActiveMenu('Operações');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <FormWrapper
            title="Registo de Resultados Policiais"
            description="Preencha os detalhes abaixo para registar novos resultados policiais."
            onSubmit={handleSubmit}
        >
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
            
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {menuItems.map(item => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setActiveMenu(item)}
                            className={`${
                                activeMenu === item
                                    ? 'border-custom-blue-500 text-custom-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm focus:outline-none`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="space-y-6">
                {activeMenu === 'Operações' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Detalhes da Operação</legend>
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-3 gap-6">
                                <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" required /></div>
                                <div>
                                    <Label htmlFor="periodo">Período</Label>
                                    <Select id="periodo" name="periodo" required><option value="">Selecione o Período</option>{PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}</Select>
                                </div>
                                <div><Label htmlFor="tipoOperacao">Tipo de Operação</Label><Input id="tipoOperacao" name="tipoOperacao" type="text" /></div>
                                <div>
                                    <Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label>
                                    <Select id="unidadeEsquadra" name="unidadeEsquadra" required><option value="">Selecione a Unidade</option>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select>
                                </div>
                                 <div>
                                    <Label htmlFor="municipio">Município</Label>
                                    <Select id="municipio" name="municipio" required><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select>
                                </div>
                                <div><Label htmlFor="local">Local Específico</Label><Input id="local" name="local" type="text" /></div>
                            </div>
                             <div>
                                <Label htmlFor="objetivo">Objetivo da Operação</Label>
                                <Textarea id="objetivo" name="objetivo" />
                            </div>
                            <div>
                                <Label htmlFor="resultadosObtidos">Resultados Obtidos</Label>
                                <Textarea id="resultadosObtidos" name="resultadosObtidos" />
                            </div>
                        </div>
                    </fieldset>
                )}
                 {activeMenu === 'Patrulhamentos' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Detalhes do Patrulhamento</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                             <div>
                                <Label htmlFor="tipoPatrulhamento">Tipo de Patrulhamento</Label>
                                <Select id="tipoPatrulhamento" name="tipoPatrulhamento">
                                    <option value="">Selecione o tipo</option>
                                    <option value="Apeado">Apeado</option>
                                    <option value="Auto">Auto</option>
                                    <option value="Misto">Misto</option>
                                </Select>
                            </div>
                            <div><Label htmlFor="areaPatrulhada">Área Patrulhada</Label><Input id="areaPatrulhada" name="areaPatrulhada" type="text" /></div>
                            <div className="md:col-span-2">
                                <Label htmlFor="ocorrenciasRegistadas">Ocorrências Registadas</Label>
                                <Textarea id="ocorrenciasRegistadas" name="ocorrenciasRegistadas" />
                            </div>
                        </div>
                    </fieldset>
                )}
                {activeMenu === 'Detidos' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Informação do Detido</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                           <div><Label htmlFor="detidoNome">Nome do Detido</Label><Input id="detidoNome" name="detidoNome" type="text" /></div>
                           <div><Label htmlFor="detidoIdade">Idade</Label><Input id="detidoIdade" name="detidoIdade" type="number" /></div>
                           <div className="md:col-span-3"><Label htmlFor="motivoDetencao">Motivo da Detenção</Label><Input id="motivoDetencao" name="motivoDetencao" type="text" /></div>
                        </div>
                    </fieldset>
                )}
                {activeMenu === 'Outros' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Outras Informações</legend>
                         <div className="mt-4">
                            <Label htmlFor="observacoesGerais" className="sr-only">Observações Gerais</Label>
                            <Textarea id="observacoesGerais" name="observacoesGerais" placeholder="Adicione aqui outras informações relevantes, como apreensões, etc." />
                        </div>
                    </fieldset>
                )}
            </div>
        </FormWrapper>
    );
};

export default ResultadosForm;
