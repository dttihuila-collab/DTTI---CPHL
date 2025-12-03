import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { UNIDADES_ESQUADRAS, ESTADO_MEIOS, TIPOS_VESTUARIO, PATENTES, ORGAOS_UNIDADES } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { ArmamentIcon, ClothingIcon } from '../../components/icons/Icon';

const menuItems = [
    { name: 'Armamento', icon: <ArmamentIcon /> },
    { name: 'Vestuário', icon: <ClothingIcon /> },
];

const LogisticaForm: React.FC = React.memo(() => {
    const [activeMenu, setActiveMenu] = useState('Armamento');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [efectivos, setEfectivos] = useState<{ nip: string, nome: string }[]>([]);
    const { addToast } = useToast();
    // FIX: Destructured `refreshKey` from `useDataRefresh` to use in the `useEffect` dependency array.
    const { triggerRefresh, refreshKey } = useDataRefresh();

    useEffect(() => {
        const fetchEfectivos = async () => {
            try {
                const records = await api.getRecords('logistica');
                const armamentoRecords = records.filter(r => r.categoriaLogistica === 'Armamento');
                const efectivosData = armamentoRecords.map(r => ({
                    nip: r.nip,
                    nome: r.nomeCompleto,
                })).filter(e => e.nip && e.nome); 
                setEfectivos(efectivosData);
            } catch (error) {
                console.error("Failed to fetch efectivos", error);
                addToast('Falha ao carregar lista de efectivos.', 'error');
            }
        };
        fetchEfectivos();
    }, [addToast, refreshKey]);

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
        return (
            <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Registo de Ficha de Agente</legend>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1"><Label htmlFor="numFicha">Nº da Ficha</Label><Input id="numFicha" name="numFicha" type="text" /></div>
                    <div className="md:col-span-3"><Label htmlFor="orgaoUnidade">Órgão/Unidade</Label><Select id="orgaoUnidade" name="orgaoUnidade"><option value="">Selecione</option>{ORGAOS_UNIDADES.map(o => <option key={o} value={o}>{o}</option>)}</Select></div>
                    
                    <div className="md:col-span-1"><Label htmlFor="nip">NIP</Label><Input id="nip" name="nip" type="text" /></div>
                    <div className="md:col-span-3"><Label htmlFor="patente">Patente</Label><Select id="patente" name="patente"><option value="">Selecione</option>{PATENTES.map(p => <option key={p} value={p}>{p}</option>)}</Select></div>
                    
                    <div className="md:col-span-4"><Label htmlFor="nomeCompleto">Nome completo</Label><Input id="nomeCompleto" name="nomeCompleto" type="text" /></div>
                    
                    <div className="md:col-span-2"><Label htmlFor="funcao">Função</Label><Input id="funcao" name="funcao" type="text" /></div>
                    <div className="md:col-span-2"><Label htmlFor="dataIncorporacao">Data de Incorporação</Label><Input id="dataIncorporacao" name="dataIncorporacao" type="date" /></div>

                    <div className="md:col-span-4"><Label htmlFor="localIngresso">Local de Ingresso</Label><Input id="localIngresso" name="localIngresso" type="text" /></div>
                    
                    <div className="md:col-span-2"><Label htmlFor="dataAbertura">Data de Abertura</Label><Input id="dataAbertura" name="dataAbertura" type="date" /></div>
                </div>
            </fieldset>
        );
    };

    const VestuarioTab = () => (
        <fieldset className="border dark:border-gray-600 p-4 rounded-md animate-fade-in">
            <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Registo de Vestuário</legend>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><Label htmlFor="numRegisto">Nº de Registo</Label><Input id="numRegisto" name="numRegisto" type="text" /></div>
                <div className="md:col-span-2">
                    <Label htmlFor="efectivoId">Nome do Efectivo</Label>
                    <Select id="efectivoId" name="efectivoId">
                        <option value="">Selecione o efectivo</option>
                        {efectivos.map(ef => (
                            <option key={ef.nip} value={ef.nip}>
                                {ef.nip} - {ef.nome}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="md:col-span-3">
                    <Label htmlFor="tipoFardamento">Tipo de Fardamento</Label>
                    <Select id="tipoFardamento" name="tipoFardamento">
                        <option value="">Selecione o tipo</option>
                        {TIPOS_VESTUARIO.map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-6 md:col-span-3">
                    <div><Label htmlFor="tamanhoBone">Tamanho do Boné</Label><Input id="tamanhoBone" name="tamanhoBone" type="number" /></div>
                    <div><Label htmlFor="tamanhoBoina">Tamanho da Boina</Label><Input id="tamanhoBoina" name="tamanhoBoina" type="number" /></div>
                    <div><Label htmlFor="calcadoNum">Calçado Nº</Label><Input id="calcadoNum" name="calcadoNum" type="number" /></div>

                    <div><Label htmlFor="camisaNum">Camisa Nº</Label><Input id="camisaNum" name="camisaNum" type="number" /></div>
                    <div><Label htmlFor="calcaNum">Calça Nº</Label><Input id="calcaNum" name="calcaNum" type="number" /></div>
                    <div><Label htmlFor="casacoNum">Casaco Nº</Label><Input id="casacoNum" name="casacoNum" type="number" /></div>
                </div>

                <div className="md:col-span-2"><Label htmlFor="atendente">Atendente</Label><Input id="atendente" name="atendente" type="text" /></div>
                <div><Label htmlFor="dataEntrega">Data de Entrega</Label><Input id="dataEntrega" name="dataEntrega" type="date" /></div>
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
                {activeMenu === 'Vestuário' && <VestuarioTab />}
            </div>
        </FormWrapper>
    );
});

export default LogisticaForm;
