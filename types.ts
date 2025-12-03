export enum Role {
  Admin = 'Administrador',
  Padrao = 'Padrão',
}

export interface User {
  // FIX: Changed id to be required to ensure it exists for existing users,
  // which is necessary for components like DataTable that rely on a stable ID.
  id: number;
  name: string;
  email?: string;
  role: Role;
  passwordHash?: string;
  permissions?: View[];
}

export type View =
  | 'Dashboard'
  | 'ActionMenu'
  | 'Criminalidade'
  | 'Sinistralidade Rodoviária'
  | 'Resultados Operacionais'
  | 'Transportes'
  | 'Logística'
  | 'Autos de Expediente'
  | 'Processos'
  | 'Gerir Usuários'
  | 'Relatórios'
  | 'Database Setup';

export interface NavItem {
  name: View;
  roles: Role[];
}

export type FamíliaCriminal = 'Crimes Contra Pessoa' | 'Crimes Contra o Património' | 'Crimes Contra Ambiente' | 'Crimes Contra Autoridade' | 'Crimes Contra Ordem e Tranquilidade Pública' | 'Crimes Contra Mercado e Economia' | 'Outros';

export type CrimeData = {
    [key in FamíliaCriminal]: string[];
};

export type DashboardCategory = 'Criminalidade' | 'Sinistralidade Rodoviária' | 'Resultados Operacionais' | 'Transportes' | 'Logística' | 'Autos de Expediente' | 'Processos';

export type ApiKey = 'criminalidade' | 'sinistralidade' | 'resultados' | 'transportes' | 'logistica' | 'autosExpediente' | 'processos';

export interface DataRecord {
  id: number;
  createdAt: string;
  [key: string]: any;
}

// Specific Record Types
export interface CriminalidadeRecord extends DataRecord {
  familiaCriminal: FamíliaCriminal;
  crime: string;
  municipio: string;
  vitimaNome: string;
  acusadoNome: string;
}

export interface SinistralidadeRecord extends DataRecord {
    categoria: 'Acidentes' | 'Vítimas' | 'Outros';
    tipoAcidente?: string;
    vitimaEstado?: 'Fatal' | 'Grave' | 'Ligeiro' | 'Ileso';
}

export interface ResultadosRecord extends DataRecord {
    categoria: 'Operações' | 'Patrulhamentos' | 'Detidos' | 'Outros';
}

export interface TransportesRecord extends DataRecord {
    categoria: 'Municípios' | 'Membros' | 'Manutenções' | 'Outros';
}


type ArmamentoData = {
    categoriaLogistica: 'Armamento';
    numFicha?: string;
    orgaoUnidade?: string;
    nip?: string;
    patente?: string;
    nomeCompleto?: string;
    funcao?: string;
    dataIncorporacao?: string;
    localIngresso?: string;
    dataAbertura?: string;
};

type VestuarioData = {
    categoriaLogistica: 'Vestuário';
    numRegisto?: string;
    efectivoId?: string; 
    tipoFardamento?: string;
    tamanhoBone?: string;
    tamanhoBoina?: string;
    calcadoNum?: string;
    camisaNum?: string;
    calcaNum?: string;
    casacoNum?: string;
    atendente?: string;
    dataEntrega?: string;
};

export type LogisticaRecord = DataRecord & (ArmamentoData | VestuarioData);

export interface AutosExpedienteRecord extends DataRecord {
    numeroAuto: string;
    tipoAuto: string;
    entidade: string;
    descricaoFactos: string;
}

export interface ProcessosRecord extends DataRecord {
    numeroProcesso: string;
    tipoProcesso: string;
    arguido: string;
    vitima: string;
    estado: 'Em instrução' | 'Julgado' | 'Arquivado';
}