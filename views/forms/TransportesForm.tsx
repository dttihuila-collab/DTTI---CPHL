
import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';

const menuItems = ['Municípios', 'Membros', 'Manutenções', 'Outros'];

const TransportesForm: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState('Municípios');
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
            await api.addRecord('transportes', data);

            addToast(`Dados de transportes (${activeMenu}) submetidos com sucesso!`, 'success');
            triggerRefresh();
            form.reset();
            setActiveMenu('Municípios');
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const MunicipiosTab = () => (
        <div className="space-y-6 animate-fade-in">
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 px-2">Registo de Combustível</legend>
                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                        <Label htmlFor="combustivel">Combustível</Label>
                        <Select id="combustivel" name="combustivel" required><option value="">Selecione o Combustível</option><option value="Gasolina">Gasolina</option><option value="Gasóleo">Gasóleo</option></Select>
                    </div>
                    <div><Label htmlFor="quantidade">Quantidade (Litros)</Label><Input id="quantidade" name="quantidade" type="number" required /></div>
                </div>
            </fieldset>
            
            <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 px-2">Distribuição por Município</legend>
                <div className="grid grid-cols-3 gap-6 mt-4">
                    <div><Label htmlFor="municipio">Município</Label><Select id="municipio" name="municipio" required><option value="">Selecione o Município</option>{MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
                    <div><Label htmlFor="quantidadeRecebida">Quantidade Recebida</Label><Input id="quantidadeRecebida" name="quantidadeRecebida" type="number" required /></div>
                    <div><Label htmlFor="existencia">Existência</Label><Input id="existencia" name="existencia" type="number" required /></div>
                </div>
            </fieldset>
        </div>
    );
    
    const MembrosTab = () => (
        <fieldset className="border p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 px-2">Registo de Pessoal</legend>
            <div className="grid grid-cols-4 gap-6 mt-4">
                <div><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" type="text" required /></div>
                <div><Label htmlFor="patente">Patente</Label><Input id="patente" name="patente" type="text" /></div>
                <div><Label htmlFor="area">Área</Label><Input id="area" name="area" type="text" /></div>
                <div><Label htmlFor="quantidadeRecebidaPessoal">Quantidade Recebida</Label><Input id="quantidadeRecebidaPessoal" name="quantidadeRecebidaPessoal" type="number" /></div>
            </div>
        </fieldset>
    );

    const ManutencoesTab = () => (
         <fieldset className="border p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 px-2">Registo de Manutenção de Veículos</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div><Label htmlFor="veiculoMatricula">Veículo (Matrícula)</Label><Input id="veiculoMatricula" name="veiculoMatricula" type="text" required/></div>
                <div>
                    <Label htmlFor="tipoManutencao">Tipo de Manutenção</Label>
                    <Select id="tipoManutencao" name="tipoManutencao"><option value="">Selecione o tipo</option><option value="Preventiva">Preventiva</option><option value="Corretiva">Corretiva</option></Select>
                </div>
                <div><Label htmlFor="custoManutencao">Custo (AOA)</Label><Input id="custoManutencao" name="custoManutencao" type="number" /></div>
                <div className="md:col-span-3"><Label htmlFor="descManutencao">Descrição do Serviço</Label><Textarea id="descManutencao" name="descManutencao" /></div>
            </div>
        </fieldset>
    );

    const OutrosTab = () => (
         <fieldset className="border p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 px-2">Observações Gerais</legend>
             <div className="mt-4">
                <Label htmlFor="obsGerais" className="sr-only">Observações Gerais</Label>
                <Textarea id="obsGerais" name="obsGerais" placeholder="Adicione aqui outras informações relevantes..." />
            </div>
        </fieldset>
    );

    return (
        <FormWrapper
            title="Registo de Transportes"
            description="Registe informações sobre combustíveis, pessoal e manutenções."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
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
                {activeMenu === 'Municípios' && <MunicipiosTab />}
                {activeMenu === 'Membros' && <MembrosTab />}
                {activeMenu === 'Manutenções' && <ManutencoesTab />}
                {activeMenu === 'Outros' && <OutrosTab />}
            </div>
        </FormWrapper>
    );
};

export default TransportesForm;
