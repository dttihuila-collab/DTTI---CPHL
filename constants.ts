import { User, Role, CrimeData, View, Subsystem } from './types';

// SECURITY-FIX: Passwords are no longer stored in plaintext.
// A mock hash is stored instead (btoa('user') -> 'dXNlcg==').
export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin', role: Role.Admin, passwordHash: 'dXNlcg==', patente: 'Comissário', orgaoUnidade: 'Comando Provincial', funcao: 'Comandante' },
  { id: 2, name: 'Supervisor', role: Role.Supervisor, passwordHash: 'dXNlcg==', patente: 'Superintendente-Chefe', orgaoUnidade: 'Departamento de Operações', funcao: 'Supervisor Geral' },
  { id: 3, name: 'Operador Padrão', role: Role.Padrao, passwordHash: 'dXNlcg==', permissions: ['Ocorrências Policiais', 'Transportes'], patente: 'Agente de 1ª Classe', orgaoUnidade: '1ª Esquadra', funcao: 'Agente de Campo' },
  { id: 4, name: 'Operador Logistica', role: Role.Padrao, passwordHash: 'dXNlcg==', permissions: ['Logística'], patente: 'Agente', orgaoUnidade: 'Secção de Logística', funcao: 'Operador' },
  { id: 5, name: 'Nilton Gourgel', role: Role.Supervisor, passwordHash: 'dXNlcg==', patente: 'Inspector-Chefe', orgaoUnidade: 'Departamento de Telec. Tec. de Informação', funcao: 'Chefe de Departamento' },
];

export const ALL_VIEWS: { [key in View]?: { roles: Role[] } } = {
    'Dashboard': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Criminalidade': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Sinistralidade Rodoviária': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Enfrentamento Policial': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Transportes': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Logística': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Gerir Usuários': { roles: [Role.Admin] },
    'Relatórios': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Database Setup': { roles: [Role.Admin] },
    'Registar Ocorrência': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Consultar Ocorrências': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Auto de Queixa': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Auto de Apreensão': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Auto de Notícia': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Aviso de Notificação': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Informação': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Participação': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Apresentação': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
    'Processos': { roles: [Role.Admin, Role.Padrao, Role.Supervisor] },
};

export const SUBSYSTEMS: Record<Subsystem, { views: View[], roles: Role[] }> = {
    'Ocorrências Policiais': {
        views: ['Dashboard', 'Criminalidade', 'Sinistralidade Rodoviária', 'Enfrentamento Policial', 'Consultar Ocorrências'],
        roles: [Role.Admin, Role.Padrao, Role.Supervisor],
    },
    'Transportes': {
        views: ['Dashboard', 'Transportes', 'Relatórios'],
        roles: [Role.Admin, Role.Padrao, Role.Supervisor],
    },
    'Logística': {
        views: ['Dashboard', 'Logística', 'Relatórios'],
        roles: [Role.Admin, Role.Padrao, Role.Supervisor],
    },
    'Autos de Expedientes': {
        views: ['Dashboard', 'Auto de Queixa', 'Auto de Apreensão', 'Auto de Notícia', 'Aviso de Notificação', 'Informação', 'Participação', 'Apresentação', 'Processos', 'Relatórios'],
        roles: [Role.Admin, Role.Padrao, Role.Supervisor],
    },
    'Administração do Sistema': {
        views: ['Gerir Usuários', 'Database Setup'],
        roles: [Role.Admin],
    },
};


export const MUNICIPIOS_HUILA: string[] = [
    "C. Cavilngo",
    "Caconda",
    "Cacula",
    "Caluquembe",
    "Capelongo",
    "Chibia",
    "Chicomba",
    "Chicungo",
    "Chipindo",
    "Chituto",
    "Cuvango",
    "Dongo",
    "Galangui",
    "Gambos",
    "Hoque",
    "Humpata",
    "Jamba",
    "Lubango",
    "Matala",
    "Palanca",
    "Quilengues",
    "Quipungo",
    "Viti Vivali"
];

export const UNIDADES_ESQUADRAS: string[] = [
    "Comando Municipal", "1ª Esquadra", "2ª Esquadra", "3ª Esquadra", 
    "4ª Esquadra", "5ª Esquadra", "6ª Esquadra", "7ª Esquadra", 
    "8ª Esquadra", "9ª Esquadra", "10ª Esquadra", "11ª Esquadra", "12ª Esquadra"
];

export const ORGAOS_UNIDADES: string[] = [
    "Departamento de Telec. Tec. de Informação",
    "Comando Provincial",
    "Direcção de Recursos Humanos",
    "Departamento de Operações",
    "Secção de Logística",
    ...UNIDADES_ESQUADRAS
];

export const PATENTES: string[] = [
    "Comissário",
    "Superintendente-Chefe",
    "Superintendente",
    "Intendente",
    "Inspector-Chefe",
    "Inspector",
    "Sub-Inspector",
    "Agente de 1ª Classe",
    "Agente de 2ª Classe",
    "Agente"
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
    'Crimes Contra Pessoa': ['Homicídio', 'Ofensa a Integridade Física', 'Ameaça', 'Sequestro', 'Rapto', 'Abuso Sexual', 'Agressão Sexual'],
    'Crimes Contra o Património': ['Roubo', 'Furto', 'Danos', 'Burla', 'Abuso de Confiança', 'Uso e Abuso de cartão de Crédito, Debito ou Garantia', 'Incêndio'],
    'Crimes Contra Ambiente': ['Agressão Ambiental'],
    'Crimes Contra Autoridade': ['Desobediência', 'Resistência', 'Libertação de Recluso', 'Usurpação de Funções'],
    'Crimes Contra Ordem e Tranquilidade Pública': ['Participação em motim', 'Associação Criminosa', 'Posse Ilegal de arma de fogo', 'Posse e consumo de Cannabis', 'Exercício Ilegal Profissão'],
    'Crimes Contra Mercado e Economia': ['Corrupção', 'Exploração e Trafico Ilegal Minerais', 'Especulação'],
    'Outros': ['Não especificado']
};

export const TODOS_OS_CRIMES: string[] = [...new Set(Object.values(CRIMES_POR_FAMILIA).flat())].sort();

export const TIPOS_ACIDENTE: string[] = [
    "Colisão entre veículos",
    "Colisão com obstáculo fixo",
    "Atropelamento",
    "Despiste seguido de capotamento",
    "Despiste",
    "Capotamento",
    "Incêndio de veículo"
];

export const CAUSAS_ACIDENTE: string[] = [
    "Excesso de velocidade",
    "Não cedência de prioridade",
    "Condução sob efeito de álcool",
    "Uso do telemóvel",
    "Cansaço ou sonolência",
    "Más condições da via",
    "Avaria mecânica"
];

export const TIPOS_AUTO_EXPEDIENTE: string[] = [
    'Auto de Queixa',
    'Auto de Apreensão',
    'Auto de Notícia',
    'Aviso de Notificação',
    'Informação',
    'Participação',
    'Apresentação'
];

export const TIPOS_VIATURA: string[] = [
    'Ligeiro de Passageiros',
    'Ligeiro de Mercadorias',
    'Pesado de Passageiros',
    'Pesado de Mercadorias',
    'Motociclo',
];

export const ESTADOS_VIATURA: string[] = [
    'Operacional',
    'Inoperacional',
    'Em Manutenção',
];

// FIX: Added constants for the new ProcessosForm.
export const TIPOS_PROCESSO: string[] = [
    'Processo-Crime Comum',
    'Processo de Querela',
    'Processo Sumário',
    'Processo de Transgressão'
];

export const FASES_PROCESSO: string[] = [
    'Instrução Preparatória',
    'Acusação',
    'Julgamento',
    'Recurso',
    'Concluído'
];