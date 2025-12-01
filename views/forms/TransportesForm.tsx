
import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA } from '../../constants';
import { api } from '../../services/api';

const TransportesForm: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        await api.addRecord('transportes', data);

        setSuccessMessage('Dados de transportes submetidos com sucesso!');
        form.reset();
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <FormWrapper
            title="Registo de Transportes"
            description="Registe informações sobre combustíveis e distribuição."
            onSubmit={handleSubmit}
        >
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
            
            <div className="space-y-6">
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Registo de Combustível</legend>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                            <Label htmlFor="combustivel">Combustível</Label>
                            <Select id="combustivel" name="combustivel" required>
                                <option value="">Selecione o Combustível</option>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Gasóleo">Gasóleo</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="quantidade">Quantidade (Litros)</Label>
                            <Input id="quantidade" name="quantidade" type="number" required />
                        </div>
                    </div>
                </fieldset>
                
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Distribuição por Município</legend>
                     <div className="grid grid-cols-3 gap-6 mt-4">
                        <div>
                            <Label htmlFor="municipio">Município</Label>
                            <Select id="municipio" name="municipio" required>
                                <option value="">Selecione o Município</option>
                                {MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="quantidadeRecebida">Quantidade Recebida</Label>
                            <Input id="quantidadeRecebida" name="quantidadeRecebida" type="number" required />
                        </div>
                         <div>
                            <Label htmlFor="existencia">Existência</Label>
                            <Input id="existencia" name="existencia" type="number" required />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-md">
                    <legend className="text-lg font-medium text-gray-900 px-2">Registo de Pessoal</legend>
                    <div className="grid grid-cols-4 gap-6 mt-4">
                        <div><Label htmlFor="nome">Nome</Label><Input id="nome" name="nome" type="text" required /></div>
                        <div><Label htmlFor="patente">Patente</Label><Input id="patente" name="patente" type="text" /></div>
                        <div><Label htmlFor="area">Área</Label><Input id="area" name="area" type="text" /></div>
                        <div><Label htmlFor="quantidadeRecebidaPessoal">Quantidade Recebida</Label><Input id="quantidadeRecebidaPessoal" name="quantidadeRecebidaPessoal" type="number" /></div>
                    </div>
                </fieldset>
            </div>
        </FormWrapper>
    );
};

export default TransportesForm;