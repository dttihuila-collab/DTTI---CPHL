import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TIPOS_AUTO_EXPEDIENTE, UNIDADES_ESQUADRAS, PATENTES, SERVICOS_ATENDIMENTO, ESTADOS_CIVIS, GENEROS, NACIONALIDADES, PROFISSOES } from '../../constants';

interface AutosExpedienteFormProps {
    initialData?: { tipoAuto?: string };
}

const initialFormData = {
    tipoAuto: '',
    numeroAuto: '',
    dataAuto: '',
    horaAuto: '',
    servicoDe: '',
    nomeFuncionario: '',
    postoPatente: '',
    esquadra: '',
    noticianteNomeCompleto: '',
    noticianteFilhoDe: '',
    noticianteEDe: '',
    noticianteNdoBilhete: '',
    noticianteGenero: '',
    noticianteNacionalidade: 'Angolana',
    noticianteResidente: '',
    noticianteBairro: '',
    noticianteProximo: '',
    noticianteContacto: '',
    noticianteEstadoCivil: '',
    noticianteIdade: '',
    noticianteNatural: '',
    noticianteRua: '',
    noticianteProfissao: '',
    noticianteLocalTrabalho: '',
    queixadoNomeCompleto: '',
    queixadoNomePai: '',
    queixadoEDe: '',
    queixadoNdoBilhete: '',
    queixadoGenero: '',
    queixadoNacionalidade: 'Angolana',
    queixadoResidente: '',
    queixadoBairro: '',
    queixadoProximo: '',
    queixadoContacto: '',
    queixadoEstadoCivil: '',
    queixadoIdade: '',
    queixadoNacional: '',
    queixadoRua: '',
    queixadoProfissao: '',
    queixadoLocalTrabalho: '',
    descricaoFactos: '',
};

const AutosExpedienteForm: React.FC<AutosExpedienteFormProps> = React.memo(({ initialData }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (initialData?.tipoAuto) {
            setFormData(prev => ({ ...initialFormData, tipoAuto: initialData.tipoAuto || '' }));
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
            setFormData({ ...initialFormData, tipoAuto: initialData?.tipoAuto || '' });
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormWrapper
            title={`Registo de ${formData.tipoAuto || 'Auto de Expediente'}`}
            description="Preencha os detalhes abaixo para registar um novo Auto de Expediente."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <div className="space-y-6">
                {/* DADOS DA ESQUADRA */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                    <div className="bg-gray-200 dark:bg-gray-700 p-2 font-semibold text-gray-800 dark:text-gray-200">DADOS DA ESQUADRA</div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3"><Label>Nº do Auto</Label><Input name="numeroAuto" value={formData.numeroAuto} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label>Data</Label><Input name="dataAuto" type="date" value={formData.dataAuto} onChange={handleChange} /></div>
                        <div className="md:col-span-2"><Label>Hora</Label><Input name="horaAuto" type="time" value={formData.horaAuto} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Tipo de Auto</Label><Select name="tipoAuto" value={formData.tipoAuto} onChange={handleChange} required><option value="">Selecione</option>{TIPOS_AUTO_EXPEDIENTE.map(t=><option key={t} value={t}>{t}</option>)}</Select></div>
                        <div className="md:col-span-4"><Label>Serviço de</Label><Select name="servicoDe" value={formData.servicoDe} onChange={handleChange}><option value="">Selecione</option>{SERVICOS_ATENDIMENTO.map(s=><option key={s} value={s}>{s}</option>)}</Select></div>
                        <div className="md:col-span-5"><Label>Nome do Funcionário</Label><Input name="nomeFuncionario" value={formData.nomeFuncionario} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label>Posto/Patente</Label><Select name="postoPatente" value={formData.postoPatente} onChange={handleChange}><option value="">Selecione</option>{PATENTES.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
                        <div className="md:col-span-12"><Label>Esquadra</Label><Select name="esquadra" value={formData.esquadra} onChange={handleChange}><option value="">Selecione</option>{UNIDADES_ESQUADRAS.map(u=><option key={u} value={u}>{u}</option>)}</Select></div>
                    </div>
                </div>

                {/* DADOS DO NOTICIANTE */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                    <div className="bg-gray-200 dark:bg-gray-700 p-2 font-semibold text-gray-800 dark:text-gray-200">DADOS DO NOTICIANTE</div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6"><Label>Nome Completo</Label><Input name="noticianteNomeCompleto" value={formData.noticianteNomeCompleto} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Estado Civil</Label><Select name="noticianteEstadoCivil" value={formData.noticianteEstadoCivil} onChange={handleChange}><option value="">Selecione</option>{ESTADOS_CIVIS.map(e=><option key={e} value={e}>{e}</option>)}</Select></div>
                        <div className="md:col-span-2"><Label>Idade</Label><Input name="noticianteIdade" type="number" value={formData.noticianteIdade} onChange={handleChange} /></div>
                        <div className="md:col-span-6"><Label>Filho de</Label><Input name="noticianteFilhoDe" value={formData.noticianteFilhoDe} onChange={handleChange} /></div>
                        <div className="md:col-span-6"><Label>E de</Label><Input name="noticianteEDe" value={formData.noticianteEDe} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label>Nº do Bilhete</Label><Input name="noticianteNdoBilhete" value={formData.noticianteNdoBilhete} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label>Género</Label><Select name="noticianteGenero" value={formData.noticianteGenero} onChange={handleChange}><option value="">Selecione</option>{GENEROS.map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
                        <div className="md:col-span-3"><Label>Nacionalidade</Label><Select name="noticianteNacionalidade" value={formData.noticianteNacionalidade} onChange={handleChange}><option value="">Selecione</option>{NACIONALIDADES.map(n=><option key={n} value={n}>{n}</option>)}</Select></div>
                        <div className="md:col-span-3"><Label>Natural</Label><Input name="noticianteNatural" value={formData.noticianteNatural} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Residente</Label><Input name="noticianteResidente" value={formData.noticianteResidente} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Bairro</Label><Input name="noticianteBairro" value={formData.noticianteBairro} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Rua</Label><Input name="noticianteRua" value={formData.noticianteRua} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Próximo</Label><Input name="noticianteProximo" value={formData.noticianteProximo} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Profissão</Label><Select name="noticianteProfissao" value={formData.noticianteProfissao} onChange={handleChange}><option value="">Selecione</option>{PROFISSOES.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
                        <div className="md:col-span-4"><Label>Local de Trabalho</Label><Input name="noticianteLocalTrabalho" value={formData.noticianteLocalTrabalho} onChange={handleChange} /></div>
                        <div className="md:col-span-12"><Label>Contacto</Label><Input name="noticianteContacto" value={formData.noticianteContacto} onChange={handleChange} /></div>
                    </div>
                </div>

                {/* DADOS DO QUEIXADO */}
                <div className="border border-red-300 dark:border-red-600 rounded-md">
                    <div className="bg-red-200 dark:bg-red-800 p-2 font-semibold text-red-800 dark:text-red-200">DADOS DO QUEIXADO</div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6"><Label>Nome Completo</Label><Input name="queixadoNomeCompleto" value={formData.queixadoNomeCompleto} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Estado Civil</Label><Select name="queixadoEstadoCivil" value={formData.queixadoEstadoCivil} onChange={handleChange}><option value="">Selecione</option>{ESTADOS_CIVIS.map(e=><option key={e} value={e}>{e}</option>)}</Select></div>
                        <div className="md:col-span-2"><Label>Idade</Label><Input name="queixadoIdade" type="number" value={formData.queixadoIdade} onChange={handleChange} /></div>
                        <div className="md:col-span-6"><Label>Nome do Pai</Label><Input name="queixadoNomePai" value={formData.queixadoNomePai} onChange={handleChange} /></div>
                        <div className="md:col-span-6"><Label>E de</Label><Input name="queixadoEDe" value={formData.queixadoEDe} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label>Nº do Bilhete</Label><Input name="queixadoNdoBilhete" value={formData.queixadoNdoBilhete} onChange={handleChange} /></div>
                        <div className="md:col-span-3"><Label>Género</Label><Select name="queixadoGenero" value={formData.queixadoGenero} onChange={handleChange}><option value="">Selecione</option>{GENEROS.map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
                        <div className="md:col-span-3"><Label>Nacionalidade</Label><Select name="queixadoNacionalidade" value={formData.queixadoNacionalidade} onChange={handleChange}><option value="">Selecione</option>{NACIONALIDADES.map(n=><option key={n} value={n}>{n}</option>)}</Select></div>
                        <div className="md:col-span-3"><Label>Nacional</Label><Input name="queixadoNacional" value={formData.queixadoNacional} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Residente</Label><Input name="queixadoResidente" value={formData.queixadoResidente} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Bairro</Label><Input name="queixadoBairro" value={formData.queixadoBairro} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Rua</Label><Input name="queixadoRua" value={formData.queixadoRua} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Próximo</Label><Input name="queixadoProximo" value={formData.queixadoProximo} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Profissão</Label><Select name="queixadoProfissao" value={formData.queixadoProfissao} onChange={handleChange}><option value="">Selecione</option>{PROFISSOES.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
                        <div className="md:col-span-4"><Label>Local de Trabalho</Label><Input name="queixadoLocalTrabalho" value={formData.queixadoLocalTrabalho} onChange={handleChange} /></div>
                        <div className="md:col-span-12"><Label>Contacto</Label><Input name="queixadoContacto" value={formData.queixadoContacto} onChange={handleChange} /></div>
                    </div>
                </div>
                
                {/* DESCRIÇÃO DOS FACTOS */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-md">
                    <div className="bg-gray-200 dark:bg-gray-700 p-2 font-semibold text-gray-800 dark:text-gray-200">DESCRIÇÃO DOS FACTOS</div>
                    <div className="p-4">
                        <Textarea name="descricaoFactos" rows={6} value={formData.descricaoFactos} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </FormWrapper>
    );
});

export default AutosExpedienteForm;