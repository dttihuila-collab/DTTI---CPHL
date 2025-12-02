import { User, Role, NavItem, CrimeData, View } from './types';

export const PERMISSION_VIEWS: View[] = ['Dashboard', 'Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais', 'Transportes', 'Logística'];

// SECURITY-FIX: Passwords are no longer stored in plaintext.
// A mock hash is stored instead (btoa('user') -> 'dXNlcg==').
export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin', role: Role.Admin, passwordHash: 'dXNlcg==', permissions: PERMISSION_VIEWS },
  { id: 2, name: 'Padrao', role: Role.Padrao, passwordHash: 'dXNlcg==', permissions: ['Dashboard', 'Criminalidade', 'Sinistralidade Rodoviária'] },
  { id: 3, name: 'Visualizador', role: Role.Padrao, passwordHash: 'dXNlcg==', permissions: ['Dashboard'] },
];

export const APP_VIEWS: NavItem[] = [
  { name: 'Dashboard', roles: [Role.Admin, Role.Padrao] },
  { name: 'Criminalidade', roles: [Role.Admin, Role.Padrao] },
  { name: 'Sinistralidade Rodoviária', roles: [Role.Admin, Role.Padrao] },
  { name: 'Resultados Operacionais', roles: [Role.Admin, Role.Padrao] },
  { name: 'Transportes', roles: [Role.Admin, Role.Padrao] },
  { name: 'Logística', roles: [Role.Admin, Role.Padrao] },
  { name: 'Gerir Usuários', roles: [Role.Admin] },
  { name: 'Relatórios', roles: [Role.Admin, Role.Padrao] },
  { name: 'Database Setup', roles: [Role.Admin] },
];

export const MUNICIPIOS_HUILA: string[] = [
    "Caconda", "Cacula", "Caluquembe", "Chibia", "Chicomba", "Chipindo", 
    "Cuvango", "Humpata", "Jamba", "Lubango", "Matala", "Quilengues", 
    "Quipungo"
];

export const UNIDADES_ESQUADRAS: string[] = [
    "Comando Municipal", "1ª Esquadra", "2ª Esquadra", "3ª Esquadra", 
    "4ª Esquadra", "5ª Esquadra", "6ª Esquadra", "7ª Esquadra", 
    "8ª Esquadra", "9ª Esquadra", "10ª Esquadra", "11ª Esquadra", "12ª Esquadra",
    "Outra"
];

export const PERIODOS: string[] = ["Iº", "IIº", "IIIº"];

export const FAMILIAS_CRIMINAIS: string[] = [
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

export const TODOS_OS_CRIMES: string[] = [...new Set(Object.values(CRIMES_POR_FAMILIA).flat())].sort();

export const TIPOS_ACIDENTE: string[] = [
    "Colisão",
    "Atropelamento",
    "Despiste",
    "Capotamento",
    "Abalroamento",
    "Choque com obstáculo fixo",
    "Incêndio de veículo",
    "Outro"
];

export const TIPOS_VEICULO: string[] = ["Ligeiro", "Pesado", "Motociclo", "Outro"];
export const ESTADO_MEIOS: string[] = ["Operacional", "Em Manutenção", "Inoperacional", "Outro"];
export const TIPOS_EQUIPAMENTO_COMUNICACAO: string[] = ["Rádio HT", "Rádio de Viatura", "Telefone Satélite", "Outro"];
export const ITENS_ESCRITORIO: string[] = ["Resma de Papel A4", "Toner de Impressora", "Canetas", "Cadernos", "Outro"];

export const TIPOS_ARMAMENTO: string[] = ["Pistola", "AKM", "G3", "Outro"];
export const CALIBRES: string[] = ["9mm", "7.62mm", "5.56mm", "Outro"];
export const TIPOS_VIVERES: string[] = ["Não Perecível", "Perecível", "Água", "Outro"];
export const TIPOS_VESTUARIO: string[] = ["Farda de Gala", "Farda de Trabalho", "Botas", "Cobertura (Boné/Boina)", "Outro"];