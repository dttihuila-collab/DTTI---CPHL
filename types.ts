export enum Role {
  Admin = 'Administrador',
  Padrao = 'Padrão',
}

export interface User {
  id?: number;
  name: string;
  email: string;
  role: Role;
  password?: string;
  permissions?: View[];
}

export type View =
  | 'Dashboard'
  | 'Criminalidade'
  | 'Sinistralidade Rodoviária'
  | 'Resultados Policiais'
  | 'Transportes'
  | 'Logística'
  | 'Gerir Usuários'
  | 'Relatórios';

export interface NavItem {
  name: View;
  roles: Role[];
}

export type CrimeFamily = 'Crimes Contra Pessoa' | 'Crimes Contra o Património' | 'Crimes Contra Ambiente' | 'Crimes Contra Autoridade' | 'Crimes Contra Ordem e Tranquilidade Pública' | 'Crimes Contra Mercado e Economia' | 'Outros';

export type CrimeData = {
    [key in CrimeFamily]: string[];
};

export type DashboardCategory = 'Criminalidade' | 'Sinistralidade Rodoviária' | 'Resultados Policiais' | 'Transportes' | 'Logística';

// FIX: Added ApiKey type to be used for database record keys, fixing reference errors to 'db'.
export type ApiKey = 'criminalidade' | 'sinistralidade' | 'resultados' | 'transportes' | 'logistica';

export interface DataRecord {
  id: number;
  createdAt: string;
  [key: string]: any;
}