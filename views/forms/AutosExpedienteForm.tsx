import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';

const AutosExpedienteForm: React.FC = React.memo(() => {
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
            await api.addRecord('autosExpediente', data);

            addToast('Auto de Expediente registado com sucesso!', 'success');
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
            title="Registo de Autos de Expediente"
            description="Preencha os detalhes para registar um novo Auto de Expediente."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-900 dark:text-gray-100 px-2">Detalhes do Auto</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div><Label htmlFor="numeroAuto">Número do Auto</Label><Input id="numeroAuto" name="numeroAuto" type="text" required /></div>
                    <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" required /></div>
                    <div className="md:col-span-2">
                        <Label htmlFor="tipoAuto">Tipo de Auto</Label>
                        <Select id="tipoAuto" name="tipoAuto" required>
                            <option value="">Selecione o tipo</option>
                            <option value="Auto de Notícia">Auto de Notícia</option>
                            <option value="Auto de Apreensão">Auto de Apreensão</option>
                            <option value="Auto de Ocorrência">Auto de Ocorrência</option>
                            <option value="Outro">Outro</option>
                        </Select>
                    </div>
                    <div className="md:col-span-2"><Label htmlFor="entidade">Entidade</Label><Input id="entidade" name="entidade" type="text" placeholder="Ex: Polícia Nacional, SIC, etc." /></div>
                    <div className="md:col-span-2">
                        <Label htmlFor="descricaoFactos">Descrição dos Factos</Label>
                        <Textarea id="descricaoFactos" name="descricaoFactos" required />
                    </div>
                </div>
            </fieldset>
        </FormWrapper>
    );
});

export default AutosExpedienteForm;
