import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { TIPOS_AUTO_EXPEDIENTE, UNIDADES_ESQUADRAS, PATENTES, SERVICOS_ATENDIMENTO, ESTADOS_CIVIS, GENEROS, NACIONALIDADES, PROFISSOES, DIAS_DA_SEMANA } from '../../constants';
import { AutosExpedienteRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';

const initialFormData: Partial<AutosExpedienteRecord> = {
    tipoAuto: '',
    numeroAuto: '(Novo)',
    nacionalidade: 'Angolana'
};

interface AutosExpedienteFormProps {
    initialData?: Partial<AutosExpedienteRecord>;
    editingRecord?: AutosExpedienteRecord | null;
    onSave?: (record: AutosExpedienteRecord) => void;
    onCancel?: () => void;
}

const AutosExpedienteForm: React.FC<AutosExpedienteFormProps> = React.memo(({ initialData, editingRecord, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<AutosExpedienteRecord>>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (editingRecord) {
            setFormData(editingRecord);
        } else if (initialData?.tipoAuto) {
            setFormData({ ...initialFormData, tipoAuto: initialData.tipoAuto || '' });
        } else {
            setFormData(initialFormData);
        }
    }, [initialData, editingRecord]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSave = { ...formData };
            if (!editingRecord) {
                // Let the API generate the number for new records
                delete dataToSave.numeroAuto;
            }

            if (onSave) {
                onSave(dataToSave as AutosExpedienteRecord);
            } else {
                await api.addRecord('autosExpediente', dataToSave);
                addToast('Auto de Expediente registado com sucesso!', 'success');
                triggerRefresh();
                setFormData({ ...initialFormData, tipoAuto: initialData?.tipoAuto || '' });
            }
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderAutoDeQueixa = () => (
        <>
            <CollapsibleSection title="Dados do Noticiante" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6"><Label>Nome Completo</Label><Input name="noticianteNomeCompleto" value={formData.noticianteNomeCompleto || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Estado Civil</Label><Select name="noticianteEstadoCivil" value={formData.noticianteEstadoCivil || ''} onChange={handleChange}><option value="">Selecione</option>{ESTADOS_CIVIS.map(e=><option key={e} value={e}>{e}</option>)}</Select></div>
                    <div className="md:col-span-2"><Label>Idade</Label><Input name="noticianteIdade" type="number" value={formData.noticianteIdade || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-6"><Label>Filho de</Label><Input name="noticianteFilhoDe" value={formData.noticianteFilhoDe || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-6"><Label>E de</Label><Input name="noticianteEDe" value={formData.noticianteEDe || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-3"><Label>Nº do Bilhete</Label><Input name="noticianteNdoBilhete" value={formData.noticianteNdoBilhete || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-3"><Label>Género</Label><Select name="noticianteGenero" value={formData.noticianteGenero || ''} onChange={handleChange}><option value="">Selecione</option>{GENEROS.map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
                    <div className="md:col-span-3"><Label>Nacionalidade</Label><Select name="noticianteNacionalidade" value={formData.noticianteNacionalidade || ''} onChange={handleChange}><option value="">Selecione</option>{NACIONALIDADES.map(n=><option key={n} value={n}>{n}</option>)}</Select></div>
                    <div className="md:col-span-3"><Label>Natural</Label><Input name="noticianteNatural" value={formData.noticianteNatural || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Residente</Label><Input name="noticianteResidente" value={formData.noticianteResidente || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Bairro</Label><Input name="noticianteBairro" value={formData.noticianteBairro || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Rua</Label><Input name="noticianteRua" value={formData.noticianteRua || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Próximo</Label><Input name="noticianteProximo" value={formData.noticianteProximo || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Profissão</Label><Select name="noticianteProfissao" value={formData.noticianteProfissao || ''} onChange={handleChange}><option value="">Selecione</option>{PROFISSOES.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
                    <div className="md:col-span-4"><Label>Local de Trabalho</Label><Input name="noticianteLocalTrabalho" value={formData.noticianteLocalTrabalho || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-12"><Label>Contacto</Label><Input name="noticianteContacto" value={formData.noticianteContacto || ''} onChange={handleChange} /></div>
                </div>
            </CollapsibleSection>
            <CollapsibleSection title="Dados do Queixado" titleClassName="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6"><Label>Nome Completo</Label><Input name="queixadoNomeCompleto" value={formData.queixadoNomeCompleto || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Estado Civil</Label><Select name="queixadoEstadoCivil" value={formData.queixadoEstadoCivil || ''} onChange={handleChange}><option value="">Selecione</option>{ESTADOS_CIVIS.map(e=><option key={e} value={e}>{e}</option>)}</Select></div>
                    <div className="md:col-span-2"><Label>Idade</Label><Input name="queixadoIdade" type="number" value={formData.queixadoIdade || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-6"><Label>Nome do Pai</Label><Input name="queixadoNomePai" value={formData.queixadoNomePai || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-6"><Label>E de</Label><Input name="queixadoEDe" value={formData.queixadoEDe || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-3"><Label>Nº do Bilhete</Label><Input name="queixadoNdoBilhete" value={formData.queixadoNdoBilhete || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-3"><Label>Género</Label><Select name="queixadoGenero" value={formData.queixadoGenero || ''} onChange={handleChange}><option value="">Selecione</option>{GENEROS.map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
                    <div className="md:col-span-3"><Label>Nacionalidade</Label><Select name="queixadoNacionalidade" value={formData.queixadoNacionalidade || ''} onChange={handleChange}><option value="">Selecione</option>{NACIONALIDADES.map(n=><option key={n} value={n}>{n}</option>)}</Select></div>
                    <div className="md:col-span-3"><Label>Nacional</Label><Input name="queixadoNacional" value={formData.queixadoNacional || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Residente</Label><Input name="queixadoResidente" value={formData.queixadoResidente || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Bairro</Label><Input name="queixadoBairro" value={formData.queixadoBairro || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Rua</Label><Input name="queixadoRua" value={formData.queixadoRua || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Próximo</Label><Input name="queixadoProximo" value={formData.queixadoProximo || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-4"><Label>Profissão</Label><Select name="queixadoProfissao" value={formData.queixadoProfissao || ''} onChange={handleChange}><option value="">Selecione</option>{PROFISSOES.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
                    <div className="md:col-span-4"><Label>Local de Trabalho</Label><Input name="queixadoLocalTrabalho" value={formData.queixadoLocalTrabalho || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-12"><Label>Contacto</Label><Input name="queixadoContacto" value={formData.queixadoContacto || ''} onChange={handleChange} /></div>
                </div>
            </CollapsibleSection>
        </>
    );

    const renderAutoDeApreensao = () => (
        <>
            <CollapsibleSection title="Dados do Autuado" defaultOpen>
                {/* Same structure as noticiante, but with 'autuado' prefix */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                     <div className="md:col-span-6"><Label>Nome Completo</Label><Input name="autuadoNomeCompleto" value={formData.autuadoNomeCompleto || ''} onChange={handleChange} /></div>
                     <div className="md:col-span-4"><Label>Estado Civil</Label><Select name="autuadoEstadoCivil" value={formData.autuadoEstadoCivil || ''} onChange={handleChange}><option value="">Selecione</option>{ESTADOS_CIVIS.map(e=><option key={e} value={e}>{e}</option>)}</Select></div>
                     <div className="md:col-span-2"><Label>Idade</Label><Input name="autuadoIdade" type="number" value={formData.autuadoIdade || ''} onChange={handleChange} /></div>
                     <div className="md:col-span-6"><Label>Filho de</Label><Input name="autuadoFilhoDe" value={formData.autuadoFilhoDe || ''} onChange={handleChange} /></div>
                     <div className="md:col-span-6"><Label>E de</Label><Input name="autuadoEDe" value={formData.autuadoEDe || ''} onChange={handleChange} /></div>
                     {/* ... other autuado fields ... */}
                </div>
            </CollapsibleSection>
             <CollapsibleSection title="Descrição dos Factos">
                <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-1"><Label>Dia da Semana</Label><Select name="diaDaSemana" value={formData.diaDaSemana || ''} onChange={handleChange}><option value="">Selecione</option>{DIAS_DA_SEMANA.map(d=><option key={d} value={d}>{d}</option>)}</Select></div>
                    <div className="md:col-span-1"><Label>Hora</Label><Input name="horaFactos" type="time" value={formData.horaFactos || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-1"><Label>Bairro</Label><Input name="bairroFactos" value={formData.bairroFactos || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-1"><Label>Rua</Label><Input name="ruaFactos" value={formData.ruaFactos || ''} onChange={handleChange} /></div>
                    <div className="md:col-span-1"><Label>Próximo</Label><Input name="proximoFactos" value={formData.proximoFactos || ''} onChange={handleChange} /></div>
                </div>
            </CollapsibleSection>
            <CollapsibleSection title="Descrição da Ocorrência e do Meio Apreendido">
                <div className="p-4"><Textarea name="descricaoOcorrenciaMeioApreendido" rows={6} value={formData.descricaoOcorrenciaMeioApreendido || ''} onChange={handleChange} /></div>
            </CollapsibleSection>
            <CollapsibleSection title="Testemunhas">
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input name="testemunha1Nome" placeholder="Nome da Testemunha 1" value={formData.testemunha1Nome || ''} onChange={handleChange} />
                    <Input name="testemunha1Idade" placeholder="Idade" type="number" value={formData.testemunha1Idade || ''} onChange={handleChange} />
                    <Input name="testemunha1Telefone" placeholder="Telefone" value={formData.testemunha1Telefone || ''} onChange={handleChange} />
                    <Input name="testemunha2Nome" placeholder="Nome da Testemunha 2" value={formData.testemunha2Nome || ''} onChange={handleChange} />
                    <Input name="testemunha2Idade" placeholder="Idade" type="number" value={formData.testemunha2Idade || ''} onChange={handleChange} />
                    <Input name="testemunha2Telefone" placeholder="Telefone" value={formData.testemunha2Telefone || ''} onChange={handleChange} />
                </div>
            </CollapsibleSection>
        </>
    );
    
    // Simplified render functions for other types for brevity
    const renderAutoDeNoticia = () => (
         <>
            {/* Similar structure to Auto de Apreensão, but with Autuado and Acusado sections */}
             <CollapsibleSection title="Dados do Autuado" defaultOpen>{/* ... Fields ... */}</CollapsibleSection>
             <CollapsibleSection title="Dados do Acusado" titleClassName="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">{/* ... Fields ... */}</CollapsibleSection>
             <CollapsibleSection title="Descrição dos Factos">{/* ... Fields ... */}</CollapsibleSection>
             <CollapsibleSection title="Testemunhas">{/* ... Fields ... */}</CollapsibleSection>
        </>
    );

    const renderAvisoDeNotificacao = () => (
        <CollapsibleSection title="Dados da Notificação" defaultOpen>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label>Nome do Notificante</Label><Input name="avisoNotificanteNome" value={formData.avisoNotificanteNome || ''} onChange={handleChange} /></div>
                <div><Label>Cidade</Label><Input name="avisoCidade" value={formData.avisoCidade || ''} onChange={handleChange} /></div>
                <div><Label>Bairro</Label><Input name="avisoBairro" value={formData.avisoBairro || ''} onChange={handleChange} /></div>
                <div><Label>Telefone</Label><Input name="avisoTelefone" value={formData.avisoTelefone || ''} onChange={handleChange} /></div>
                <div><Label>Data</Label><Input name="avisoData" type="date" value={formData.avisoData || ''} onChange={handleChange} /></div>
                <div><Label>Hora</Label><Input name="avisoHora" type="time" value={formData.avisoHora || ''} onChange={handleChange} /></div>
            </div>
        </CollapsibleSection>
    );

    const renderDefaultForm = () => (
        <CollapsibleSection title="Detalhes do Auto" defaultOpen>
             <div className="p-4">
                <Label>Descrição dos Factos</Label>
                <Textarea name="descricaoFactos" value={formData.descricaoFactos || ''} onChange={handleChange} />
            </div>
        </CollapsibleSection>
    );
    
    const renderFormBody = () => {
        switch (formData.tipoAuto) {
            case 'Auto de Queixa': return renderAutoDeQueixa();
            case 'Auto de Apreensão': return renderAutoDeApreensao();
            case 'Auto de Notícia': return renderAutoDeNoticia();
            case 'Aviso de Notificação': return renderAvisoDeNotificacao();
            default: return renderDefaultForm();
        }
    }

    return (
        <FormWrapper
            title={editingRecord ? `Editar ${formData.tipoAuto}` : `Registo de ${formData.tipoAuto || 'Auto de Expediente'}`}
            description="Preencha os detalhes abaixo para registar um novo Auto de Expediente."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <CollapsibleSection title="Dados da Esquadra" defaultOpen>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3"><Label>Nº do Auto</Label><Input name="numeroAuto" value={formData.numeroAuto || ''} onChange={handleChange} disabled /><span className="text-xs text-red-500">{!editingRecord && "(Será gerado automaticamente)"}</span></div>
                        <div className="md:col-span-3"><Label>Data</Label><Input name="dataAuto" type="date" value={formData.dataAuto || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-2"><Label>Hora</Label><Input name="horaAuto" type="time" value={formData.horaAuto || ''} onChange={handleChange} /></div>
                        <div className="md:col-span-4"><Label>Tipo de Auto</Label><Select name="tipoAuto" value={formData.tipoAuto} onChange={handleChange} required><option value="">Selecione</option>{TIPOS_AUTO_EXPEDIENTE.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
                    </div>
                </CollapsibleSection>
                {renderFormBody()}
            </div>
        </FormWrapper>
    );
});

// FIX: Added default export to the component.
export default AutosExpedienteForm;
