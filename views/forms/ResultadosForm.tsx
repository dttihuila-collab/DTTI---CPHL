
import React, { useState } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select } from '../../components/common/FormElements';
import { MUNICIPIOS_HUILA, UNIDADES_ESQUADRAS, PERIODOS } from '../../constants';
import { api } from '../../services/api';

const ResultadosForm: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        await api.addRecord('resultados', data);

        setSuccessMessage('Dados de resultados policiais submetidos com sucesso!');
        form.reset();
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <FormWrapper
            title="Registo de Resultados Policiais"
            description="Preencha os detalhes abaixo para registar novos resultados policiais."
            onSubmit={handleSubmit}
        >
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
            
            <div className="grid grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" name="data" type="datetime-local" required />
                </div>
                <div>
                    <Label htmlFor="periodo">Período</Label>
                    <Select id="periodo" name="periodo" required>
                        <option value="">Selecione o Período</option>
                        {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="municipio">Município</Label>
                    <Select id="municipio" name="municipio" required>
                        <option value="">Selecione o Município</option>
                        {MUNICIPIOS_HUILA.map(m => <option key={m} value={m}>{m}</option>)}
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="unidadeEsquadra">Unidade/Esquadra</Label>
                    <Select id="unidadeEsquadra" name="unidadeEsquadra" required>
                        <option value="">Selecione a Unidade</option>
                        {UNIDADES_ESQUADRAS.map(u => <option key={u} value={u}>{u}</option>)}
                    </Select>
                </div>
                <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" name="comuna" type="text" /></div>
                <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" type="text" /></div>
                <div><Label htmlFor="rua">Rua</Label><Input id="rua" name="rua" type="text" /></div>
                <div><Label htmlFor="local">Local</Label><Input id="local" name="local" type="text" /></div>
                <div><Label htmlFor="pontoReferencia">Ponto de Referência</Label><Input id="pontoReferencia" name="pontoReferencia" type="text" /></div>
            </div>
        </FormWrapper>
    );
};

export default ResultadosForm;