import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { UNIDADES_ESQUADRAS, TIPOS_ARMAMENTO, CALIBRES, ESTADO_MEIOS, TIPOS_VIVERES, TIPOS_VESTUARIO } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { ArmamentIcon, ProvisionsIcon, ClothingIcon } from '../../components/icons/Icon';

const menuItems = [
    { name: 'Armamento', icon: <ArmamentIcon /> },
    { name: 'Viveres', icon: <ProvisionsIcon /> },
    { name: 'Vestuário', icon: <ClothingIcon /> },
];

const LogisticaForm: React.FC = React.memo(() => {
    const [activeMenu, setActiveMenu] = useState('Armamento');
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
            data.categoriaLogistica = activeMenu;
            
            await api.addRecord('logistica', data);
            
            addToast(`Dados de logística (${activeMenu}) submetidos com sucesso!`, 'success');
            triggerRefresh();
            form.reset();
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Internal components for each tab
    const ArmamentoTab = () => {
        const [showOutro, setShowOutro] = useState({ tipoArmamento: false, calibre: false, estadoArma: false, unidadeArma: false });
        const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const { name, value } = e.target;
            setShowOutro(prev => ({ ...prev, [name]: value === 'Outro' || value === 'Outra' }));
        };
        return (
            <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Registo de Armamento</legend>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2"><Label htmlFor="agenteNome">Nome</Label><Input id="agenteNome" name="agenteNome" type="text" /></div>
                    <div><Label htmlFor="agenteNIP">NIP</Label><Input id="agenteNIP" name="agenteNIP" type="text" /></div>
                    <div><Label htmlFor="agentePatente">Patente</Label><Input id="agentePatente" name="agentePatente" type="text" /></div>
                    <div className="md:col-span-4"><Label htmlFor="agenteFuncao">Função</Label><Input id="agenteFuncao" name="agenteFuncao" type="text" /></div>
                </div>
                <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Dados da Arma</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div><Label htmlFor="tipoArmamento">Tipo de Armamento</Label><Select id="tipoArmamento" name="tipoArmamento" onChange={handleSelectChange}>{TIPOS_ARMAMENTO.map(t => <option key={t} value={t}>{t}</option>)}</Select>{showOutro.tipoArmamento && <Input name="outroTipoArmamento" type="text" placeholder="Especifique" className="mt-2" />}</div>
                        <div><Label htmlFor="numSerieArma">Número de Série</Label><Input id="numSerieArma" name="numSerieArma" type="text" /></div>
                        <div><Label htmlFor="calibre">Calibre</Label><Select id="calibre" name="calibre" onChange={handleSelectChange}>{CALIBRES.map(c => <option key={c} value={c}>{c}</option>)}</Select>{showOutro.calibre && <Input name="outroCalibre" type="text" placeholder="Especifique" className="mt-2" />}</div>
                        <div><Label htmlFor="estadoArma">Estado</Label><Select id="estadoArma" name="estadoArma" onChange={handleSelectChange}>{ESTADO_MEIOS.map(e => <option key={e} value={e}>{e}</option>)}</Select>{showOutro.estadoArma && <Input name="outroEstadoArma" type="text" placeholder="Especifique" className="mt-2" />}</div>
                        <div className="md:col-span-2"><Label htmlFor="unidadeArma">Unidade/Esquadra</Label><Select id="unidadeArma" name="unidadeArma" onChange={handleSelectChange}>{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select>{showOutro.unidadeArma && <Input name="outroUnidadeArma" type="text" placeholder="Especifique" className="mt-2" />}</div>
                        <div className="md:col-span-4"><Label htmlFor="obsArma">Observações</Label><Textarea id="obsArma" name="obsArma" /></div>
                    </div>
                </div>
            </fieldset>
        );
    };

    const ViveresTab = () => (
        <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Registo de Viveres</legend>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2"><Label htmlFor="agenteNome">Nome do Responsável</Label><Input id="agenteNome" name="agenteNome" type="text" /></div>
                <div><Label htmlFor="agenteNIP">NIP</Label><Input id="agenteNIP" name="agenteNIP" type="text" /></div>
                <div><Label htmlFor="agentePatente">Patente</Label><Input id="agentePatente" name="agentePatente" type="text" /></div>
            </div>
            <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Detalhes dos Viveres</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div><Label htmlFor="tipoViveres">Tipo</Label><Select id="tipoViveres" name="tipoViveres">{TIPOS_VIVERES.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
                    <div className="md:col-span-2"><Label htmlFor="descViveres">Descrição</Label><Input id="descViveres" name="descViveres" type="text" /></div>
                    <div><Label htmlFor="qtdViveres">Quantidade</Label><Input id="qtdViveres" name="qtdViveres" type="number" /></div>
                    <div><Label htmlFor="validadeViveres">Validade</Label><Input id="validadeViveres" name="validadeViveres" type="date" /></div>
                    <div className="md:col-span-2"><Label htmlFor="unidadeViveres">Unidade de Armazenamento</Label><Select id="unidadeViveres" name="unidadeViveres">{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                </div>
            </div>
        </fieldset>
    );

    const VestuarioTab = () => (
        <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Registo de Vestuário</legend>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2"><Label htmlFor="agenteNome">Nome do Responsável</Label><Input id="agenteNome" name="agenteNome" type="text" /></div>
                <div><Label htmlFor="agenteNIP">NIP</Label><Input id="agenteNIP" name="agenteNIP" type="text" /></div>
                <div><Label htmlFor="agentePatente">Patente</Label><Input id="agentePatente" name="agentePatente" type="text" /></div>
            </div>
            <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Detalhes da Peça</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div><Label htmlFor="tipoVestuario">Tipo</Label><Select id="tipoVestuario" name="tipoVestuario">{TIPOS_VESTUARIO.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
                    <div><Label htmlFor="tamanhoVestuario">Tamanho</Label><Input id="tamanhoVestuario" name="tamanhoVestuario" type="text" /></div>
                    <div><Label htmlFor="qtdVestuario">Quantidade</Label><Input id="qtdVestuario" name="qtdVestuario" type="number" /></div>
                    <div><Label htmlFor="estadoVestuario">Estado</Label><Select id="estadoVestuario" name="estadoVestuario">{ESTADO_MEIOS.map(e => <option key={e} value={e}>{e}</option>)}</Select></div>
                    <div className="md:col-span-2"><Label htmlFor="unidadeVestuario">Unidade</Label><Select id="unidadeVestuario" name="unidadeVestuario">{UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}</Select></div>
                </div>
            </div>
        </fieldset>
    );


    return (
        <FormWrapper
            title="Registo de Meios Logísticos"
            description="Registe e organize os meios logísticos disponíveis."
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
                {activeMenu === 'Armamento' && <ArmamentoTab />}
                {activeMenu === 'Viveres' && <ViveresTab />}
                {activeMenu === 'Vestuário' && <VestuarioTab />}
            </div>
        </FormWrapper>
    );
});

export default LogisticaForm;