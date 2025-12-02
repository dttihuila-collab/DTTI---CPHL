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
  password?: string;
  permissions?: View[];
}

export type View =
  | 'Dashboard'
  | 'Criminalidade'
  | 'Sinistralidade Rodoviária'
  | 'Enfrentamento Policial'
  | 'Transportes'
  | 'Logística'
  | 'Gerir Usuários'
  | 'Relatórios'
  | 'Database Setup';

export interface NavItem {
  name: View;
  roles: Role[];
}

export type CrimeFamily = 'Crimes Contra Pessoa' | 'Crimes Contra o Património' | 'Crimes Contra Ambiente' | 'Crimes Contra Autoridade' | 'Crimes Contra Ordem e Tranquilidade Pública' | 'Crimes Contra Mercado e Economia' | 'Outros';

export type CrimeData = {
    [key in CrimeFamily]: string[];
};

export type DashboardCategory = 'Criminalidade' | 'Sinistralidade Rodoviária' | 'Enfrentamento Policial' | 'Transportes' | 'Logística';

export type ApiKey = 'criminalidade' | 'sinistralidade' | 'resultados' | 'transportes' | 'logistica';

export interface DataRecord {
  id: number;
  createdAt: string;
  [key: string]: any;
}

// Specific Record Types
export interface CriminalidadeRecord extends DataRecord {
  familiaDeletiva: CrimeFamily;
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

export interface LogisticaRecord extends DataRecord {
    categoriaLogistica: 'Armamento' | 'Viveres' | 'Vestuario';
    agenteNome: string;
    tipoArmamento?: string;
    numSerieArma?: string;
}