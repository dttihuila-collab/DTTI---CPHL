import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';

const ProcessosForm: React.FC = React.memo(() => {
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
            await api.addRecord('processos', data);

            addToast('Processo registado com sucesso!', 'success');
            triggerRefresh();
            form.reset();
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormWrapper
            title="Registo de Processos"
            description="Preencha os detalhes para registar um novo processo."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Detalhes do Processo</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div><Label htmlFor="numeroProcesso">Número do Processo</Label><Input id="numeroProcesso" name="numeroProcesso" type="text" required /></div>
                    <div><Label htmlFor="dataAbertura">Data de Abertura</Label><Input id="dataAbertura" name="dataAbertura" type="datetime-local" required /></div>
                    <div className="md:col-span-2">
                        <Label htmlFor="tipoProcesso">Tipo de Processo</Label>
                        <Select id="tipoProcesso" name="tipoProcesso" required>
                            <option value="">Selecione o tipo</option>
                            <option value="Processo-crime">Processo-crime</option>
                            <option value="Processo de Querela">Processo de Querela</option>
                            <option value="Processo Sumário">Processo Sumário</option>
                            <option value="Outro">Outro</option>
                        </Select>
                    </div>
                    <div><Label htmlFor="arguido">Arguido</Label><Input id="arguido" name="arguido" type="text" /></div>
                    <div><Label htmlFor="vitima">Vítima</Label><Input id="vitima" name="vitima" type="text" /></div>
                    <div className="md:col-span-2">
                        <Label htmlFor="estado">Estado do Processo</Label>
                         <Select id="estado" name="estado" required>
                            <option value="Em instrução">Em instrução</option>
                            <option value="Julgado">Julgado</option>
                            <option value="Arquivado">Arquivado</option>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea id="observacoes" name="observacoes" />
                    </div>
                </div>
            </fieldset>
        </FormWrapper>
    );
});

export default ProcessosForm;
