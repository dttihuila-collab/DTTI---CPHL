import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TIPOS_AUTO_EXPEDIENTE } from '../../constants';

interface AutosExpedienteFormProps {
    initialData?: { tipoAuto?: string };
}

const AutosExpedienteForm: React.FC<AutosExpedienteFormProps> = React.memo(({ initialData }) => {
    const [formData, setFormData] = useState({
        numeroAuto: '',
        data: '',
        tipoAuto: '',
        entidade: '',
        descricaoFactos: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            await api.addRecord('autosExpediente', formData);

            addToast('Auto de Expediente registado com sucesso!', 'success');
            triggerRefresh();
            setFormData({ numeroAuto: '', data: '', tipoAuto: initialData?.tipoAuto || '', entidade: '', descricaoFactos: '' });
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
                    <div><Label htmlFor="numeroAuto">Número do Auto</Label><Input id="numeroAuto" name="numeroAuto" type="text" value={formData.numeroAuto} onChange={handleChange} required /></div>
                    <div><Label htmlFor="data">Data</Label><Input id="data" name="data" type="datetime-local" value={formData.data} onChange={handleChange} required /></div>
                    <div className="md:col-span-2">
                        <Label htmlFor="tipoAuto">Tipo de Auto</Label>
                        <Select id="tipoAuto" name="tipoAuto" value={formData.tipoAuto} onChange={handleChange} required>
                            <option value="">Selecione o tipo</option>
                            {TIPOS_AUTO_EXPEDIENTE.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="md:col-span-2"><Label htmlFor="entidade">Entidade</Label><Input id="entidade" name="entidade" type="text" value={formData.entidade} onChange={handleChange} placeholder="Ex: Polícia Nacional, SIC, etc." /></div>
                    <div className="md:col-span-2">
                        <Label htmlFor="descricaoFactos">Descrição dos Factos</Label>
                        <Textarea id="descricaoFactos" name="descricaoFactos" value={formData.descricaoFactos} onChange={handleChange} required />
                    </div>
                </div>
            </fieldset>
        </FormWrapper>
    );
});

export default AutosExpedienteForm;