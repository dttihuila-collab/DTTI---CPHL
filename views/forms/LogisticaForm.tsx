
import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { UNIDADES_ESQUADRAS, TIPOS_ARMAMENTO, CALIBRES, ESTADO_MEIOS, TIPOS_VIVERES, TIPOS_VESTUARIO } from '../../constants';
import { api } from '../../services/api';

const menuItems = ['Armamento', 'Viveres', 'Vestuario'];

const LogisticaForm: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [activeMenu, setActiveMenu] = useState('Armamento');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.categoriaLogistica = activeMenu; // Add active category to the data
        
        await api.addRecord('logistica', data);
        
        setSuccessMessage(`Dados de logística (${activeMenu}) submetidos com sucesso!`);
        form.reset();
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                            <div>
                                <Label htmlFor="tipoArmamento">Tipo de Armamento</Label>
                                <Select id="tipoArmamento" name="tipoArmamento">
                                    <option value="">Selecione o tipo</option>
                                    {TIPOS_ARMAMENTO.map(t => <option key={t} value={t}>{t}</option>)}
                                </Select>
                            </div>
                            <div><Label htmlFor="numSerieArma">Número de Série</Label><Input id="numSerieArma" name="numSerieArma" type="text" /></div>
                             <div>
                                <Label htmlFor="calibre">Calibre</Label>
                                <Select id="calibre" name="calibre">
                                    <option value="">Selecione o calibre</option>
                                    {CALIBRES.map(c => <option key={c} value={c}>{c}</option>)}
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="estadoArma">Estado</Label>
                                <Select id="estadoArma" name="estadoArma">
                                    <option value="">Selecione o estado</option>
                                    {ESTADO_MEIOS.map(e => <option key={e} value={e}>{e}</option>)}
                                </Select>
                            </div>
                             <div className="md:col-span-2">
                                <Label htmlFor="unidadeArma">Unidade/Esquadra</Label>
                                <Select id="unidadeArma" name="unidadeArma">
                                    <option value="">Selecione a unidade</option>
                                    {UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}
                                </Select>
                            </div>
                            <div className="md:col-span-4">
                                <Label htmlFor="obsArma">Observações</Label>
                                <Textarea id="obsArma" name="obsArma" />
                            </div>
                        </div>
                    </fieldset>
                )}

                {activeMenu === 'Viveres' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Registo de Viveres</legend>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
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
                    </fieldset>
                )}

                 {activeMenu === 'Vestuario' && (
                     <fieldset className="border p-4 rounded-md animate-fade-in">
                        <legend className="text-lg font-medium text-gray-900 px-2">Registo de Vestuário</legend>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
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
                                <Label htmlFor="unidadeVestuario">Unidade/Esquadra</"Label>
                                <Select id="unidadeVestuario" name="unidadeVestuario">
                                    <option value="">Selecione a unidade</option>
                                    {UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}
                                </Select>
                            </div>
                        </div>
                    </fieldset>
                )}
            </div>
        </FormWrapper>
    );
};

export default LogisticaForm;