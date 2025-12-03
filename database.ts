import { MOCK_USERS } from './constants';

const DB_KEY = 'sccphl_db';

const generateId = () => new Date().getTime() + Math.random();

const initialDb: { [key: string]: any[] } = {
    users: MOCK_USERS.map(u => ({ ...u })), 
    criminalidade: [
        { id: generateId(), createdAt: new Date('2023-10-26T10:00:00Z').toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Roubo', data: '2023-10-26T08:30', periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '1ª Esquadra', vitimaNome: 'Ana Costa', acusadoNome: 'Desconhecido' },
        { id: generateId(), createdAt: new Date('2023-10-25T15:20:00Z').toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ofensa a Integridade Física', data: '2023-10-25T14:00', periodo: 'IIº', municipio: 'Matala', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'Carlos Neves', acusadoNome: 'Manuel Golias' },
    ],
    sinistralidade: [
        { id: generateId(), createdAt: new Date('2023-10-26T18:00:00Z').toISOString(), tipoAcidente: 'Colisão', data: '2023-10-26T17:45', municipio: 'Lubango', periodo: 'IIº', vitimaNome: 'Joana Miguel', vitimaEstado: 'Ligeiro' },
        { id: generateId(), createdAt: new Date('2023-10-25T09:30:00Z').toISOString(), tipoAcidente: 'Atropelamento', data: '2023-10-25T09:25', municipio: 'Matala', periodo: 'Iº', vitimaNome: 'Criança Desconhecida', vitimaEstado: 'Grave' },
        { id: generateId(), createdAt: new Date('2023-10-24T12:00:00Z').toISOString(), tipoAcidente: 'Despiste', data: '2023-10-24T11:50', municipio: 'Quilengues', periodo: 'Iº', vitimaNome: 'Condutor', vitimaEstado: 'Fatal' },
    ],
    resultados: [
        { id: generateId(), createdAt: new Date().toISOString(), tipoOperacao: 'Stop', data: '2023-10-26T20:00', municipio: 'Lubango', resultadosObtidos: '2 viaturas apreendidas', detidoNome: 'José Firmino', motivoDetencao: 'Furto qualificado' },
        { id: generateId(), createdAt: new Date().toISOString(), tipoPatrulhamento: 'Auto', areaPatrulhada: 'Bairro Comercial', ocorrenciasRegistadas: 'Nenhuma' },
    ],
    transportes: [
        { id: generateId(), createdAt: new Date().toISOString(), combustivel: 'Gasolina', quantidade: 5000, municipio: 'Lubango', quantidadeRecebida: 2000, existencia: 3000, nome: 'Agente Silva', patente: 'Agente de 1ª', area: 'Logística', viaturaMatricula: 'LD-01-02-AA', tipoManutencao: 'Preventiva', descManutencao: 'Troca de óleo e filtros' },
    ],
    logistica: [
        { id: generateId(), createdAt: new Date().toISOString(), nip: '132257', nomeCompleto: 'Nilton Edgar Lamúrias Gourgel', patente: 'Inspector Chefe', orgaoUnidade: 'Departamento de Telec. Tec. de Informação', numFicha: '1', funcao: 'Chefe de Secção', localIngresso: 'ENPOP - Luanda', dataAbertura: '2023-08-18', dataIncorporacao: '2017-07-17' },
        { id: generateId(), createdAt: new Date().toISOString(), numRegisto: '1', efectivoId: '132257', tipoFardamento: 'Farda de Saída', tamanhoBone: '24', tamanhoBoina: '24', calcadoNum: '43', camisaNum: '42', calcaNum: '42', casacoNum: '50', atendente: 'Martinho Luter', dataEntrega: '2023-10-27' },
    ],
    autosExpediente: [
        { 
            id: generateId(), 
            createdAt: new Date().toISOString(), 
            tipoAuto: 'Auto de Queixa',
            numeroAuto: 'AQ2023/001',
            dataAuto: '2023-10-28',
            horaAuto: '14:30',
            servicoDe: 'Atendimento a vítima',
            nomeFuncionario: 'Agente Dias',
            postoPatente: 'Agente de 1ª Classe',
            esquadra: '1ª Esquadra',
            noticianteNomeCompleto: 'Maria da Conceição',
            noticianteIdade: '34',
            queixadoNomeCompleto: 'Indivíduo Desconhecido',
            descricaoFactos: 'A noticiante reportou o furto da sua carteira na via pública.',
        },
        {
            id: generateId(),
            createdAt: new Date().toISOString(),
            tipoAuto: 'Auto de Apreensão',
            numeroAuto: 'AA2023/001',
            dataAuto: '2023-10-29',
            autuadoNomeCompleto: 'Carlos Alberto',
            descricaoOcorrenciaMeioApreendido: 'Apreensão de material furtado.'
        },
        {
            id: generateId(),
            createdAt: new Date().toISOString(),
            tipoAuto: 'Auto de Notícia',
            numeroAuto: 'AN2023/001',
            dataAuto: '2023-10-30',
            autuadoNomeCompleto: 'Juliana Paes',
            acusadoNomeCompleto: 'Roberto Silva',
            descricaoFactos: 'Conflito na via pública.'
        },
        {
            id: generateId(),
            createdAt: new Date().toISOString(),
            tipoAuto: 'Aviso de Notificação',
            numeroAuto: 'AV2023/001',
            avisoNotificanteNome: 'Manuel Vicente',
            avisoData: '2023-11-05'
        }
    ],
    processos: [
        { id: generateId(), createdAt: new Date().toISOString(), numeroProcesso: 'PC2023/105', dataAbertura: new Date().toISOString(), tipoProcesso: 'Processo-crime', arguido: 'João da Silva', vitima: 'Maria Santos', estado: 'Em instrução' },
    ],
};

// Function to load the database from localStorage
export const loadDatabase = () => {
    try {
        const serializedDb = localStorage.getItem(DB_KEY);
        if (serializedDb === null) {
            // No DB found, initialize with mock data and save
            localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
            return initialDb;
        }
        const loadedDb = JSON.parse(serializedDb);
        // Ensure all keys from initialDb exist to handle updates
        for (const key in initialDb) {
            if (!loadedDb.hasOwnProperty(key)) {
                loadedDb[key] = initialDb[key];
            }
        }
        // Ensure users are always up-to-date with mock users, for demo purposes
        loadedDb.users = MOCK_USERS.map(u => ({ ...u }));
        saveDatabase(loadedDb);
        return loadedDb;
    } catch (e) {
        console.error("Failed to load database from localStorage", e);
        // Fallback to initial data if parsing fails
        return initialDb;
    }
};

// Function to save the database to localStorage
export const saveDatabase = (db: any) => {
    try {
        const serializedDb = JSON.stringify(db);
        localStorage.setItem(DB_KEY, serializedDb);
    } catch (e) {
        console.error("Failed to save database to localStorage", e);
    }
};