import React, { useState, useEffect } from 'react';
import FormWrapper from './FormWrapper';
import { Label, Input, Select, Textarea } from '../../components/common/FormElements';
import { PATENTES, ORGAOS_UNIDADES } from '../../constants';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useDataRefresh } from '../../contexts/DataRefreshContext';
import { EfetivoRecord, MaterialRecord } from '../../types';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import EditableSelect from '../../components/common/EditableSelect';

type LogisticaRecord = EfetivoRecord | MaterialRecord;
type RegistoTipo = 'Efetivo' | 'Material';

const initialFormData: Partial<LogisticaRecord> = {};

interface LogisticaFormProps {
    editingRecord?: LogisticaRecord | null;
    onSave?: (record: LogisticaRecord) => void;
    onCancel?: () => void;
}

const LogisticaForm: React.FC<LogisticaFormProps> = React.memo(({ editingRecord, onSave, onCancel }) => {
    const [registoTipo, setRegistoTipo] = useState<RegistoTipo>('Efetivo');
    const [formData, setFormData] = useState<Partial<LogisticaRecord>>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    const { triggerRefresh } = useDataRefresh();

    useEffect(() => {
        if (editingRecord) {
            const type = 'nip' in editingRecord ? 'Efetivo' : 'Material';
            setRegistoTipo(type);
            setFormData(editingRecord);
        } else {
            setFormData(initialFormData);
        }
    }, [editingRecord]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegistoTipo(e.target.value as RegistoTipo);
        setFormData({}); // Reset form when type changes
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
             if (onSave) {
                onSave(formData as LogisticaRecord);
            } else {
                await api.addRecord('logistica', formData);
                addToast(`Registo de ${registoTipo.toLowerCase()} submetido com sucesso!`, 'success');
                triggerRefresh();
                setFormData(initialFormData);
            }
        } catch (error) {
            addToast('Ocorreu um erro ao submeter os dados.', 'error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderEfetivoForm = () => (
        <CollapsibleSection title="Dados do Efetivo" defaultOpen>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><Label htmlFor="nip">NIP</Label><Input id="nip" name="nip" type="text" value={(formData as Partial<EfetivoRecord>).nip || ''} onChange={handleChange} required/></div>
                <div className="md:col-span-2"><Label htmlFor="nomeCompleto">Nome Completo</Label><Input id="nomeCompleto" name="nomeCompleto" type="text" value={(formData as Partial<EfetivoRecord>).nomeCompleto || ''} onChange={handleChange} required/></div>
                <EditableSelect label="Patente" id="patente" name="patente" value={(formData as Partial<EfetivoRecord>).patente || ''} onChange={handleChange} options={PATENTES} storageKey="sccphl_custom_patentes" required />
                <div className="md:col-span-2"><EditableSelect label="Órgão/Unidade" id="orgaoUnidade" name="orgaoUnidade" value={(formData as Partial<EfetivoRecord>).orgaoUnidade || ''} onChange={handleChange} options={ORGAOS_UNIDADES} storageKey="sccphl_custom_orgaos_unidades" required /></div>
                <div><Label htmlFor="funcao">Função</Label><Input id="funcao" name="funcao" type="text" value={(formData as Partial<EfetivoRecord>).funcao || ''} onChange={handleChange} /></div>
                <div><Label htmlFor="dataNascimento">Data de Nascimento</Label><Input id="dataNascimento" name="dataNascimento" type="date" value={(formData as Partial<EfetivoRecord>).dataNascimento || ''} onChange={handleChange} /></div>
                <div><Label htmlFor="genero">Género</Label><Select id="genero" name="genero" value={(formData as Partial<EfetivoRecord>).genero || ''} onChange={handleChange}><option value="">Selecione</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option></Select></div>
                <div><Label htmlFor="contacto">Contacto</Label><Input id="contacto" name="contacto" type="text" value={(formData as Partial<EfetivoRecord>).contacto || ''} onChange={handleChange} /></div>
                <div className="md:col-span-2"><Label htmlFor="estado">Estado</Label><Select id="estado" name="estado" value={(formData as Partial<EfetivoRecord>).estado || 'Ativo'} onChange={handleChange}><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option><option value="Reforma">Reforma</option></Select></div>
            </div>
        </CollapsibleSection>
    );

    const renderMaterialForm = () => (
        <CollapsibleSection title="Dados do Material" defaultOpen>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="tipoMaterial">Tipo de Material</Label><Select id="tipoMaterial" name="tipoMaterial" value={(formData as Partial<MaterialRecord>).tipoMaterial || ''} onChange={handleChange} required><option value="">Selecione</option><option value="Armamento">Armamento</option><option value="Fardamento">Fardamento</option><option value="Comunicações">Comunicações</option><option value="Material de Escritório">Material de Escritório</option></Select></div>
                <div><Label htmlFor="descricaoItem">Descrição do Item</Label><Input id="descricaoItem" name="descricaoItem" type="text" value={(formData as Partial<MaterialRecord>).descricaoItem || ''} onChange={handleChange} required/></div>
                <div><Label htmlFor="quantidade">Quantidade</Label><Input id="quantidade" name="quantidade" type="number" value={(formData as Partial<MaterialRecord>).quantidade || 1} onChange={handleChange} required/></div>
                <div><Label htmlFor="estado">Estado</Label><Select id="estado" name="estado" value={(formData as Partial<MaterialRecord>).estado || 'Bom'} onChange={handleChange} required><option value="Bom">Bom</option><option value="Razoável">Razoável</option><option value="Danificado">Danificado</option></Select></div>
                <div className="md:col-span-2"><Label htmlFor="nipEfetivoResponsavel">NIP do Efetivo Responsável (Opcional)</Label><Input id="nipEfetivoResponsavel" name="nipEfetivoResponsavel" type="text" value={(formData as Partial<MaterialRecord>).nipEfetivoResponsavel || ''} onChange={handleChange} /></div>
                <div className="md:col-span-2"><Label htmlFor="observacoes">Observações</Label><Textarea id="observacoes" name="observacoes" value={(formData as Partial<MaterialRecord>).observacoes || ''} onChange={handleChange} /></div>
            </div>
        </CollapsibleSection>
    );
    
    return (
        <FormWrapper
            title={editingRecord ? `Editar Registo de ${registoTipo}`: "Registo de Meios Logísticos"}
            description="Selecione o tipo de registo e preencha os detalhes."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            submitButtonText={editingRecord ? "Guardar Alterações" : "Inserir"}
        >
            <div className="space-y-6">
                <div className="max-w-xs">
                    <Label htmlFor="registoTipo">Tipo de Registo</Label>
                    <Select id="registoTipo" name="registoTipo" value={registoTipo} onChange={handleTypeChange} disabled={!!editingRecord}>
                        <option value="Efetivo">Registar Efetivo</option>
                        <option value="Material">Registar Material</option>
                    </Select>
                </div>
                {registoTipo === 'Efetivo' ? renderEfetivoForm() : renderMaterialForm()}
            </div>
        </FormWrapper>
    );
});

export default LogisticaForm;