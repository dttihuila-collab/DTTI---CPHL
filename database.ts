import { MOCK_USERS } from './constants';

const DB_KEY = 'sccphl_db';

const generateId = () => new Date().getTime() + Math.random();
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
const now = new Date();

const initialDb: { [key: string]: any[] } = {
    users: MOCK_USERS.map(u => ({ ...u })), 
    criminalidade: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Roubo', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '1ª Esquadra', vitimaNome: 'Ana Costa', acusadoNome: 'Desconhecido', modusOperandi: 'Arrombamento de residência' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ofensa a Integridade Física', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIº', municipio: 'Matala', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'Carlos Neves', acusadoNome: 'Manuel Golias' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Furto', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIIº', municipio: 'Caconda', unidadeEsquadra: '2ª Esquadra', vitimaNome: 'Sofia Almeida', acusadoNome: 'Adolescente (17 anos)', bensSubtraidos: 'Telemóvel e carteira' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Ordem e Tranquilidade Pública', crime: 'Posse Ilegal de arma de fogo', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '5ª Esquadra', acusadoNome: 'José Firmino' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Homicídio', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIº', municipio: 'Quilengues', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'António Lopes', acusadoNome: 'Em investigação', objetoUsado: 'Arma branca' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Burla', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '3ª Esquadra', vitimaNome: 'Joana Miguel', acusadoNome: 'Desconhecido', modusOperandi: 'Fraude online' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ameaça', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIIº', municipio: 'Matala', unidadeEsquadra: 'Posto Policial', vitimaNome: 'Pedro Ramos', acusadoNome: 'Vizinho' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Roubo', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Humpata', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'Turista Estrangeiro', acusadoNome: 'Grupo de jovens', bensSubtraidos: 'Câmara fotográfica' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Autoridade', crime: 'Desobediência', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIº', municipio: 'Lubango', unidadeEsquadra: 'Patrulha', acusadoNome: 'Condutor de veículo' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Danos', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Caluquembe', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'Estabelecimento Comercial', acusadoNome: 'Vândalos' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Abuso Sexual', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIº', municipio: 'Cacula', unidadeEsquadra: 'Investigação Criminal', vitimaNome: 'Vítima protegida', acusadoNome: 'Membro da família' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Incêndio', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIIº', municipio: 'Gambos', unidadeEsquadra: 'Comando Municipal', local: 'Área florestal', acusadoNome: 'Causa indeterminada' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Ordem e Tranquilidade Pública', crime: 'Posse e consumo de Cannabis', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '7ª Esquadra', acusadoNome: 'Jovem (22 anos)' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra o Património', crime: 'Furto', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'IIº', municipio: 'Matala', unidadeEsquadra: '4ª Esquadra', vitimaNome: 'Agricultor', bensSubtraidos: 'Equipamento agrícola' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ofensa a Integridade Física', data: randomDate(oneYearAgo, now).toISOString(), periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '9ª Esquadra', vitimaNome: 'Estudante', acusadoNome: 'Colega de escola' },
    ],
    sinistralidade: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Colisão', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango', periodo: 'IIº', vitimaNome: 'Joana Miguel', vitimaEstado: 'Ligeiro' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Atropelamento', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Matala', periodo: 'Iº', vitimaNome: 'Criança Desconhecida', vitimaEstado: 'Grave' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Despiste', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Quilengues', periodo: 'Iº', vitimaNome: 'Condutor', vitimaEstado: 'Fatal' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Capotamento', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Humpata', periodo: 'IIIº', vitimaNome: 'Manuel Vicente', vitimaEstado: 'Grave' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Choque com obstáculo fixo', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango', periodo: 'Iº', vitimaNome: 'Alberto João', vitimaEstado: 'Ligeiro' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Colisão', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Caconda', periodo: 'IIº', vitimaNome: 'Família Silva', vitimaEstado: 'Ileso' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Atropelamento', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango', periodo: 'Iº', vitimaNome: 'Idoso (78 anos)', vitimaEstado: 'Fatal' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Abalroamento', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Matala', periodo: 'IIIº', vitimaNome: 'Condutor de motociclo', vitimaEstado: 'Grave' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Despiste', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Chibia', periodo: 'IIº', vitimaNome: 'Jonas K.', vitimaEstado: 'Ligeiro' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAcidente: 'Incêndio de veículo', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango', periodo: 'Iº', vitimaNome: 'N/A', vitimaEstado: 'Ileso' },
    ],
    resultados: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Operações', tipoOperacao: 'Stop', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango', resultadosObtidos: '2 viaturas apreendidas por falta de documentação.', objetivo: 'Fiscalização de trânsito' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Patrulhamentos', tipoPatrulhamento: 'Auto', areaPatrulhada: 'Bairro Comercial', ocorrenciasRegistadas: 'Nenhuma', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Detidos', detidoNome: 'José Firmino', motivoDetencao: 'Furto qualificado', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Matala' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Operações', tipoOperacao: 'Busca e Apreensão', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Caconda', resultadosObtidos: 'Apreensão de 50kg de cannabis.', objetivo: 'Combate ao narcotráfico' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Patrulhamentos', tipoPatrulhamento: 'Apeado', areaPatrulhada: 'Mercado Municipal', ocorrenciasRegistadas: 'Pequenos furtos dispersados', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Quilengues' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Detidos', detidoNome: 'António Miguel', motivoDetencao: 'Posse ilegal de arma', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Operações', tipoOperacao: 'Operação Bloco', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Lubango', resultadosObtidos: 'Verificação de 150 cidadãos, 5 detidos por imigração ilegal.', objetivo: 'Controlo de imigração' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Patrulhamentos', tipoPatrulhamento: 'Misto', areaPatrulhada: 'Zonas periféricas', ocorrenciasRegistadas: 'Identificação de suspeitos', data: randomDate(oneYearAgo, now).toISOString(), municipio: 'Matala' },
    ],
    transportes: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Municípios', combustivel: 'Gasolina', quantidade: 5000, municipio: 'Lubango', quantidadeRecebida: 2000, existencia: 3000 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Municípios', combustivel: 'Gasóleo', quantidade: 10000, municipio: 'Matala', quantidadeRecebida: 4000, existencia: 6000 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Municípios', combustivel: 'Gasolina', quantidade: 3000, municipio: 'Caconda', quantidadeRecebida: 1500, existencia: 1500 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Membros', nome: 'Agente Silva', patente: 'Agente de 1ª Classe', area: 'Logística' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Membros', nome: 'Sub-Inspector Costa', patente: 'Sub-Inspector', area: 'Operações' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Manutenções', viaturaMatricula: 'LD-01-02-AA', tipoManutencao: 'Preventiva', descManutencao: 'Troca de óleo e filtros', custoManutencao: 25000 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Manutenções', viaturaMatricula: 'HL-25-18-BB', tipoManutencao: 'Corretiva', descManutencao: 'Reparação do sistema de travagem', custoManutencao: 80000 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), categoria: 'Municípios', combustivel: 'Gasóleo', quantidade: 8000, municipio: 'Quilengues', quantidadeRecebida: 3000, existencia: 5000 },
    ],
    logistica: [
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', nip: '132257', nomeCompleto: 'Nilton Edgar Lamúrias Gourgel', patente: 'Inspector-Chefe', orgaoUnidade: 'Departamento de Telec. Tec. de Informação', numFicha: '1', funcao: 'Chefe de Secção', localIngresso: 'ENPOP - Luanda', dataAbertura: '2023-08-18', dataIncorporacao: '2017-07-17' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuario', numRegisto: '1', efectivoId: '132257', tipoFardamento: 'Farda de Saída', tamanhoBone: '24', tamanhoBoina: '24', calcadoNum: '43', camisaNum: '42', calcaNum: '42', casacoNum: '50', atendente: 'Martinho Luter', dataEntrega: '2023-10-27' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', nip: '112233', nomeCompleto: 'Ana Paula dos Santos', patente: 'Agente de 1ª Classe', orgaoUnidade: '1ª Esquadra', numFicha: '2', funcao: 'Agente de Patrulha', localIngresso: 'CFP - Huíla', dataAbertura: '2020-01-15', dataIncorporacao: '2020-01-01' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuario', numRegisto: '2', efectivoId: '112233', tipoFardamento: 'Farda de Trabalho', calcadoNum: '38', camisaNum: '38', calcaNum: '40', atendente: 'Martinho Luter', dataEntrega: '2022-05-20' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', nip: '445566', nomeCompleto: 'Carlos Alberto Gomes', patente: 'Sub-Inspector', orgaoUnidade: 'Comando Municipal de Matala', numFicha: '3', funcao: 'Chefe de Posto', localIngresso: 'ENPOP - Luanda', dataAbertura: '2015-03-10', dataIncorporacao: '2015-02-20' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuario', numRegisto: '3', efectivoId: '445566', tipoFardamento: 'Botas', calcadoNum: '42', atendente: 'Sargento Pinto', dataEntrega: '2023-01-15' },
    ],
    autosExpediente: [
        { 
            id: generateId(), 
            createdAt: randomDate(oneYearAgo, now).toISOString(), 
            tipoAuto: 'Auto de Queixa',
            numeroAuto: 'AQ2023/001', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0], horaAuto: '14:30', servicoDe: 'Atendimento a vítima', nomeFuncionario: 'Agente Dias', postoPatente: 'Agente de 1ª Classe', esquadra: '1ª Esquadra',
            noticianteNomeCompleto: 'Maria da Conceição', noticianteIdade: '34', queixadoNomeCompleto: 'Indivíduo Desconhecido', descricaoFactos: 'A noticiante reportou o furto da sua carteira na via pública.',
        },
        {
            id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Auto de Apreensão', numeroAuto: 'AA2023/001', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0],
            autuadoNomeCompleto: 'Carlos Alberto', descricaoOcorrenciaMeioApreendido: 'Apreensão de material furtado (um telemóvel e um computador portátil).', esquadra: '2ª Esquadra',
        },
        {
            id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Auto de Notícia', numeroAuto: 'AN2023/001', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0],
            autuadoNomeCompleto: 'Juliana Paes', acusadoNomeCompleto: 'Roberto Silva', descricaoFactos: 'Conflito na via pública resultante de um acidente de viação menor.', esquadra: '3ª Esquadra',
        },
        {
            id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Aviso de Notificação', numeroAuto: 'AV2023/001',
            avisoNotificanteNome: 'Manuel Vicente', avisoData: '2023-11-05', esquadra: 'Comando Municipal',
        },
        { 
            id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Auto de Queixa', numeroAuto: 'AQ2023/002', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0], horaAuto: '10:00', servicoDe: 'Piquete', nomeFuncionario: 'Agente Bastos', postoPatente: 'Agente', esquadra: '5ª Esquadra',
            noticianteNomeCompleto: 'Alberto Miguel', noticianteIdade: '45', queixadoNomeCompleto: 'Vizinho (não identificado)', descricaoFactos: 'Queixa de barulho excessivo e ameaças verbais.',
        },
        {
            id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Participação', numeroAuto: 'P2023/001', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0],
            descricaoFactos: 'Participação de objecto encontrado na via pública (BI).', esquadra: '6ª Esquadra',
        },
    ],
    processos: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), numeroProcesso: 'PC2023/105', dataAbertura: randomDate(oneYearAgo, now).toISOString(), tipoProcesso: 'Processo-crime', arguido: 'João da Silva', vitima: 'Maria Santos', estado: 'Em instrução' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), numeroProcesso: 'PC2023/106', dataAbertura: randomDate(oneYearAgo, now).toISOString(), tipoProcesso: 'Processo de Querela', arguido: 'António Costa', vitima: 'Luísa Mendes', estado: 'Arquivado' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), numeroProcesso: 'PC2023/107', dataAbertura: randomDate(oneYearAgo, now).toISOString(), tipoProcesso: 'Processo-crime', arguido: 'José Firmino', vitima: 'Estabelecimento XYZ', estado: 'Julgado' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), numeroProcesso: 'PC2023/108', dataAbertura: randomDate(oneYearAgo, now).toISOString(), tipoProcesso: 'Processo Sumário', arguido: 'Carla Rocha', vitima: 'N/A', estado: 'Em instrução' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), numeroProcesso: 'PC2023/109', dataAbertura: randomDate(oneYearAgo, now).toISOString(), tipoProcesso: 'Processo-crime', arguido: 'Desconhecido', vitima: 'Ana Costa', estado: 'Em instrução' },
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
        
        let dbWasUpdated = false;
        // Ensure all keys from initialDb exist to handle updates (e.g., new data categories)
        for (const key in initialDb) {
            if (!loadedDb.hasOwnProperty(key)) {
                loadedDb[key] = initialDb[key];
                dbWasUpdated = true;
            }
        }
        
        // FIX: The logic to forcefully reset users on every load has been removed to allow persistence.
        // We only save back to localStorage if the structure was migrated.
        if (dbWasUpdated) {
             saveDatabase(loadedDb);
        }

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