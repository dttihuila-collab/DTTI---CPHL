import { MOCK_USERS } from './constants';
import { DataRecord } from './types';

const DB_KEY = 'sccphl_db';

const generateId = () => new Date().getTime() + Math.random();

const initialDb: { [key: string]: any[] } = {
    users: MOCK_USERS.map(u => ({ ...u })), 
    criminalidade: [
        { id: generateId(), createdAt: new Date('2023-10-26T10:00:00Z').toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Roubo', data: '2023-10-26T08:30', periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '1ª Esquadra', vitimaNome: 'Ana Costa', acusadoNome: 'Desconhecido' },
        { id: generateId(), createdAt: new Date('2023-10-25T15:20:00Z').toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ofensa a Integridade Física', data: '2023-10-25T14:00', periodo: 'IIº', municipio: 'Matala', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'Carlos Neves', acusadoNome: 'Manuel Golias' },
        { id: generateId(), createdAt: new Date('2023-10-24T22:10:00Z').toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Furto', data: '2023-10-24T21:00', periodo: 'IIIº', municipio: 'Humpata', unidadeEsquadra: '2ª Esquadra', vitimaNome: 'Empresa Agricola XYZ', acusadoNome: 'Desconhecido' },
        { id: generateId(), createdAt: new Date('2023-10-23T11:05:00Z').toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ameaça', data: '2023-10-23T10:45', periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '3ª Esquadra', vitimaNome: 'Sofia Pinto', acusadoNome: 'António Lopes' },
        { id: generateId(), createdAt: new Date('2023-10-22T18:00:00Z').toISOString(), familiaCriminal: 'Crimes Contra Ordem e Tranquilidade Pública', crime: 'Posse Ilegal de arma de fogo', data: '2023-10-22T17:30', periodo: 'IIº', municipio: 'Chibia', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'N/A', acusadoNome: 'Pedro Chivukuvuku' },
    ],
    sinistralidade: [
        { id: generateId(), createdAt: new Date('2023-10-26T18:00:00Z').toISOString(), categoria: 'Acidentes', tipoAcidente: 'Colisão', data: '2023-10-26T17:45', municipio: 'Lubango', periodo: 'IIº' },
        { id: generateId(), createdAt: new Date('2023-10-26T18:01:00Z').toISOString(), categoria: 'Vítimas', vitimaNome: 'Joana Miguel', vitimaEstado: 'Ligeiro' },
        { id: generateId(), createdAt: new Date('2023-10-25T09:30:00Z').toISOString(), categoria: 'Acidentes', tipoAcidente: 'Atropelamento', data: '2023-10-25T09:25', municipio: 'Matala', periodo: 'Iº' },
        { id: generateId(), createdAt: new Date('2023-10-25T09:31:00Z').toISOString(), categoria: 'Vítimas', vitimaNome: 'Criança Desconhecida', vitimaEstado: 'Grave' },
        { id: generateId(), createdAt: new Date('2023-10-24T12:00:00Z').toISOString(), categoria: 'Acidentes', tipoAcidente: 'Despiste', data: '2023-10-24T11:50', municipio: 'Quilengues', periodo: 'Iº' },
        { id: generateId(), createdAt: new Date('2023-10-24T12:01:00Z').toISOString(), categoria: 'Vítimas', vitimaNome: 'Condutor', vitimaEstado: 'Fatal' },
    ],
    resultados: [
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Operações', tipoOperacao: 'Stop', data: '2023-10-26T20:00', municipio: 'Lubango', resultadosObtidos: '2 viaturas apreendidas' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Operações', tipoOperacao: 'Fiscalização de Venda Ambulante', data: '2023-10-25T10:00', municipio: 'Lubango', resultadosObtidos: 'Vendedores sensibilizados' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Patrulhamentos', tipoPatrulhamento: 'Auto', areaPatrulhada: 'Bairro Comercial', ocorrenciasRegistadas: 'Nenhuma' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Patrulhamentos', tipoPatrulhamento: 'Apeado', areaPatrulhada: 'Centro da Cidade', ocorrenciasRegistadas: '1 desordem na via pública' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Detidos', detidoNome: 'José Firmino', motivoDetencao: 'Furto qualificado' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Detidos', detidoNome: 'Armando Faria', motivoDetencao: 'Condução em estado de embriaguez' },
    ],
    transportes: [
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Municípios', combustivel: 'Gasolina', quantidade: 5000, municipio: 'Lubango', quantidadeRecebida: 2000, existencia: 3000 },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Municípios', combustivel: 'Gasóleo', quantidade: 10000, municipio: 'Matala', quantidadeRecebida: 3000, existencia: 7000 },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Membros', nome: 'Agente Silva', patente: 'Agente de 1ª', area: 'Logística' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Membros', nome: 'Chefe Almeida', patente: 'Subchefe', area: 'Operações' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Manutenções', veiculoMatricula: 'LD-01-02-AA', tipoManutencao: 'Preventiva', descManutencao: 'Troca de óleo e filtros' },
        { id: generateId(), createdAt: new Date().toISOString(), categoria: 'Manutenções', veiculoMatricula: 'HL-05-20-BB', tipoManutencao: 'Corretiva', descManutencao: 'Reparação do sistema de travagem' },
    ],
    logistica: [
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', nip: '132257', nomeCompleto: 'Nilton Edgar Lamúrias Gourgel', patente: 'Inspector Chefe', orgaoUnidade: 'Departamento de Telec. Tec. de Informação', numFicha: '1', funcao: 'Chefe de Secção', localIngresso: 'ENPOP - Luanda', dataAbertura: '2023-08-18', dataIncorporacao: '2017-07-17' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', nip: '123456', nomeCompleto: 'Agente Santos', patente: 'Agente', orgaoUnidade: 'Comando Municipal', numFicha: '2', funcao: 'Patrulheiro', localIngresso: 'ENPOP - Luanda', dataAbertura: '2022-01-10', dataIncorporacao: '2022-01-10' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuário', numRegisto: '1', efectivoId: '132257', tipoFardamento: 'Farda de Saída', tamanhoBone: '24', tamanhoBoina: '24', calcadoNum: '43', camisaNum: '42', calcaNum: '42', casacoNum: '50', atendente: 'Martinho Luter', dataEntrega: '2023-10-27' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuário', numRegisto: '2', efectivoId: '123456', tipoFardamento: 'Farda de Trabalho', tamanhoBone: '22', tamanhoBoina: '22', calcadoNum: '41', camisaNum: '40', calcaNum: '40', casacoNum: '48', atendente: 'Sgt. Almeida', dataEntrega: '2023-10-26' },
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