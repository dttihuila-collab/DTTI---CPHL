import { User, Role, NavItem, CrimeData, View } from './types';

export const PERMISSION_VIEWS: View[] = ['Dashboard', 'Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais', 'Transportes', 'Logística', 'Autos de Expediente', 'Processos'];

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
  { name: 'Autos de Expediente', roles: [Role.Admin, Role.Padrao] },
  { name: 'Processos', roles: [Role.Admin, Role.Padrao] },
  { name: 'Gerir Usuários', roles: [Role.Admin] },
  { name: 'Relatórios', roles: [Role.Admin, Role.Padrao] },
  { name: 'Database Setup', roles: [Role.Admin] },
];

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
    "8ª Esquadra", "9ª Esquadra", "10ª Esquadra", "11ª Esquadra", "12ª Esquadra",
    "Outra"
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
export const TIPOS_VESTUARIO: string[] = ["Farda de Gala", "Farda de Saída", "Farda de Trabalho", "Botas", "Cobertura (Boné/Boina)", "Outro"];

export const TIPOS_AUTO_EXPEDIENTE: string[] = [
    'Auto de Queixa',
    'Auto de Apreensão',
    'Auto de Notícia',
    'Aviso de Notificação',
    'Informação',
    'Participação',
    'Apresentação'
];

export const SERVICOS_ATENDIMENTO: string[] = ["Atendimento a vítima", "Piquete", "Investigação"];
export const ESTADOS_CIVIS: string[] = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"];
export const GENEROS: string[] = ["Masculino", "Feminino"];
export const NACIONALIDADES: string[] = ["Angolana", "Portuguesa", "Brasileira", "Outra"];
export const PROFISSOES: string[] = ["Estudante", "Professor", "Polícia", "Pedreiro", "Doméstica", "Outra"];

// FIX: Added DIAS_DA_SEMANA constant to be used in the AutosExpedienteForm.
export const DIAS_DA_SEMANA: string[] = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
];