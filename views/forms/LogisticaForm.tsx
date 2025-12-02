
import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { UNIDADES_ESQUADRAS, TIPOS_ARMAMENTO, CALIBRES, ESTADO_MEIOS, TIPOS_VIVERES, TIPOS_VESTUARIO } from '../../constants';
import { api } from '../../services/api';

const menuItems = ['Armamento', 'Viveres', 'Vestuario'];

const LogisticaForm: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [activeMenu, setActiveMenu] = useState('Armamento');
    const [showOutro, setShowOutro] = useState({
        tipoArmamento: false,
        calibre: false,
        estadoArma: false,
        unidadeArma: false
    });

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isOutro = value === 'Outro' || value === 'Outra';
        setShowOutro(prev => ({
            ...prev,
            [name]: isOutro
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.categoriaLogistica = activeMenu;
        
        if (data.tipoArmamento === 'Outro' && data.outroTipoArmamento) {
            data.tipoArmamento = data.outroTipoArmamento;
        }
        if (data.calibre === 'Outro' && data.outroCalibre) {
            data.calibre = data.outroCalibre;
        }
        if (data.estadoArma === 'Outro' && data.outroEstadoArma) {
            data.estadoArma = data.outroEstadoArma;
        }
        if (data.unidadeArma === 'Outra' && data.outroUnidadeArma) {
            data.unidadeArma = data.outroUnidadeArma;
        }
        
        delete data.outroTipoArmamento;
        delete data.outroCalibre;
        delete data.outroEstadoArma;
        delete data.outroUnidadeArma;

        await api.addRecord('logistica', data);
        
        setSuccessMessage(`Dados de logística (${activeMenu}) submetidos com sucesso!`);
        form.reset();
        setShowOutro({
            tipoArmamento: false,
            calibre: false,
            estadoArma: false,
            unidadeArma: false
        });
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <FormWrapper
            title="Registo de Meios Logísticos"
            description="Registe e organize os meios logísticos disponíveis."
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
                {activeMenu === 'Armamento' && (
                    <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Registo de Armamento</legend>
                        
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2"><Label htmlFor="agenteNome">Nome</Label><Input id="agenteNome" name="agenteNome" type="text" /></div>
                                <div><Label htmlFor="agenteNIP">NIP</Label><Input id="agenteNIP" name="agenteNIP" type="text" /></div>
                                <div><Label htmlFor="agentePatente">Patente</Label><Input id="agentePatente" name="agentePatente" type="text" /></div>
                                <div className="md:col-span-4"><Label htmlFor="agenteFuncao">Função</Label><Input id="agenteFuncao" name="agenteFuncao" type="text" /></div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Dados da Arma</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <Label htmlFor="tipoArmamento">Tipo de Armamento</Label>
                                    <Select id="tipoArmamento" name="tipoArmamento" onChange={handleSelectChange}>
                                        <option value="">Selecione o tipo</option>
                                        {TIPOS_ARMAMENTO.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Select>
                                    {showOutro.tipoArmamento && (
                                        <Input
                                            name="outroTipoArmamento"
                                            type="text"
                                            placeholder="Especifique o tipo"
                                            className="mt-2"
                                            required
                                        />
                                    )}
                                </div>
                                <div><Label htmlFor="numSerieArma">Número de Série</Label><Input id="numSerieArma" name="numSerieArma" type="text" /></div>
                                 <div>
                                    <Label htmlFor="calibre">Calibre</Label>
                                    <Select id="calibre" name="calibre" onChange={handleSelectChange}>
                                        <option value="">Selecione o calibre</option>
                                        {CALIBRES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </Select>
                                    {showOutro.calibre && (
                                        <Input
                                            name="outroCalibre"
                                            type="text"
                                            placeholder="Especifique o calibre"
                                            className="mt-2"
                                            required
                                        />
                                    )}
                                </div>
                                 <div>
                                    <Label htmlFor="estadoArma">Estado</Label>
                                    <Select id="estadoArma" name="estadoArma" onChange={handleSelectChange}>
                                        <option value="">Selecione o estado</option>
                                        {ESTADO_MEIOS.map(e => <option key={e} value={e}>{e}</option>)}
                                    </Select>
                                    {showOutro.estadoArma && (
                                        <Input
                                            name="outroEstadoArma"
                                            type="text"
                                            placeholder="Especifique o estado"
                                            className="mt-2"
                                            required
                                        />
                                    )}
                                </div>
                                 <div className="md:col-span-2">
                                    <Label htmlFor="unidadeArma">Unidade/Esquadra</Label>
                                    <Select id="unidadeArma" name="unidadeArma" onChange={handleSelectChange}>
                                        <option value="">Selecione a unidade</option>
                                        {UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </Select>
                                     {showOutro.unidadeArma && (
                                        <Input
                                            name="outroUnidadeArma"
                                            type="text"
                                            placeholder="Especifique a unidade"
                                            className="mt-2"
                                            required
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-4">
                                    <Label htmlFor="obsArma">Observações</Label>
                                    <Textarea id="obsArma" name="obsArma" />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                )}

                {activeMenu === 'Viveres' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Registo de Viveres</legend>
                         <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2"><Label htmlFor="agenteNome">Nome</Label><Input id="agenteNome" name="agenteNome" type="text" /></div>
                                <div><Label htmlFor="agenteNIP">NIP</Label><Input id="agenteNIP" name="agenteNIP" type="text" /></div>
                                <div><Label htmlFor="agentePatente">Patente</Label><Input id="agentePatente" name="agentePatente" type="text" /></div>
                                <div className="md:col-span-4"><Label htmlFor="agenteFuncao">Função</Label><Input id="agenteFuncao" name="agenteFuncao" type="text" /></div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Detalhes dos Viveres</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <Label htmlFor="tipoViveres">Tipo de Viveres</Label>
                                    <Select id="tipoViveres" name="tipoViveres">
                                        <option value="">Selecione o tipo</option>
                                        {TIPOS_VIVERES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Select>
                                </div>
                                <div className="md:col-span-2"><Label htmlFor="descViveres">Descrição do Item</Label><Input id="descViveres" name="descViveres" type="text" /></div>
                                <div><Label htmlFor="qtdViveres">Quantidade</Label><Input id="qtdViveres" name="qtdViveres" type="number" /></div>
                                <div><Label htmlFor="validadeViveres">Data de Validade</Label><Input id="validadeViveres" name="validadeViveres" type="date" /></div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="unidadeViveres">Unidade/Esquadra de Armazenamento</Label>
                                    <Select id="unidadeViveres" name="unidadeViveres">
                                        <option value="">Selecione a unidade</option>
                                        {UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                )}

                 {activeMenu === 'Vestuario' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Registo de Vestuário</legend>
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2"><Label htmlFor="agenteNome">Nome</Label><Input id="agenteNome" name="agenteNome" type="text" /></div>
                                <div><Label htmlFor="agenteNIP">NIP</Label><Input id="agenteNIP" name="agenteNIP" type="text" /></div>
                                <div><Label htmlFor="agentePatente">Patente</Label><Input id="agentePatente" name="agentePatente" type="text" /></div>
                                <div className="md:col-span-4"><Label htmlFor="agenteFuncao">Função</Label><Input id="agenteFuncao" name="agenteFuncao" type="text" /></div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Detalhes do Vestuário</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <Label htmlFor="tipoVestuario">Tipo de Peça</Label>
                                    <Select id="tipoVestuario" name="tipoVestuario">
                                        <option value="">Selecione o tipo</option>
                                        {TIPOS_VESTUARIO.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Select>
                                </div>
                                <div><Label htmlFor="tamanhoVestuario">Tamanho</Label><Input id="tamanhoVestuario" name="tamanhoVestuario" type="text" /></div>
                                <div><Label htmlFor="qtdVestuario">Quantidade</Label><Input id="qtdVestuario" name="qtdVestuario" type="number" /></div>
                                <div>
                                    <Label htmlFor="estadoVestuario">Estado</Label>
                                    <Select id="estadoVestuario" name="estadoVestuario">
                                        <option value="">Selecione o estado</option>
                                        {ESTADO_MEIOS.map(e => <option key={e} value={e}>{e}</option>)}
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="unidadeVestuario">Unidade/Esquadra</Label>
                                    <Select id="unidadeVestuario" name="unidadeVestuario">
                                        <option value="">Selecione a unidade</option>
                                        {UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                )}
            </div>
        </FormWrapper>
    );
};

export default LogisticaForm;
