
import { User, Role, NavItem, CrimeData, View } from './types';

export const PERMISSION_VIEWS: View[] = ['Dashboard', 'Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin', email: 'admin@sccphl.com', role: Role.Admin, password: 'user', permissions: PERMISSION_VIEWS },
  { id: 2, name: 'Padrao', email: 'standard@sccphl.com', role: Role.Padrao, password: 'user', permissions: ['Dashboard', 'Criminalidade', 'Sinistralidade Rodoviária'] },
  { id: 3, name: 'Visualizador', email: 'viewer@sccphl.com', role: Role.Padrao, password: 'user', permissions: ['Dashboard'] },
];

export const APP_VIEWS: NavItem[] = [
  { name: 'Dashboard', roles: [Role.Admin, Role.Padrao] },
  { name: 'Criminalidade', roles: [Role.Admin, Role.Padrao] },
  { name: 'Sinistralidade Rodoviária', roles: [Role.Admin, Role.Padrao] },
  { name: 'Resultados Policiais', roles: [Role.Admin, Role.Padrao] },
  { name: 'Transportes', roles: [Role.Admin, Role.Padrao] },
  { name: 'Logística', roles: [Role.Admin, Role.Padrao] },
  { name: 'Gerir Usuários', roles: [Role.Admin] },
  { name: 'Relatórios', roles: [Role.Admin, Role.Padrao] },
];

export const MUNICIPIOS_HUILA: string[] = [
    "Caconda", "Cacula", "Caluquembe", "Chibia", "Chicomba", "Chipindo", 
    "Cuvango", "Humpata", "Jamba", "Lubango", "Matala", "Quilengues", 
    "Quipungo"
];

export const UNIDADES_ESQUADRAS: string[] = [
    "Comando Municipal", "1ª Esquadra", "2ª Esquadra", "3ª Esquadra", 
    "4ª Esquadra", "5ª Esquadra", "6ª Esquadra", "7ª Esquadra", 
    "8ª Esquadra", "9ª Esquadra", "10ª Esquadra", "11ª Esquadra", "12ª Esquadra"
];

export const PERIODOS: string[] = ["Iº", "IIº", "IIIº"];

export const FAMILIAS_DELETIVAS: string[] = [
    'Crimes Contra Pessoa', 
    'Crimes Contra o Património', 
    'Crimes Contra Ambiente', 
    'Crimes Contra Autoridade', 
    'Crimes Contra Ordem e Tranquilidade Pública', 
    'Crimes Contra Mercado e Economia', 
    'Outros'
];

export const CRIMES_POR_FAMILIA: CrimeData = {
    'Crimes Contra Pessoa': ['Homicídio', 'Ofensa a Integridade Física', 'Ameaça', 'Sequestro', 'Rapto', 'Abuso Sexual', 'Agressão Sexual', 'Outros'],
    'Crimes Contra o Património': ['Roubo', 'Furto', 'Danos', 'Burla', 'Abuso de Confiança', 'Uso e Abuso de cartão de Crédito, Debito ou Garantia', 'Incêndio'],
    'Crimes Contra Ambiente': ['Agressão Ambiental', 'Outros'],
    'Crimes Contra Autoridade': ['Desobediência', 'Resistência', 'Libertação de Recluso', 'Usurpação de Funções', 'Outros'],
    'Crimes Contra Ordem e Tranquilidade Pública': ['Participação em motim', 'Associação Criminosa', 'Posse Ilegal de arma de fogo', 'Posse e consumo de Cannabis', 'Exercício Ilegal Profissão', 'Outros'],
    'Crimes Contra Mercado e Economia': ['Corrupção', 'Exploração e Trafico Ilegal Minerais', 'Especulação', 'Outros'],
    'Outros': ['Não especificado']
};