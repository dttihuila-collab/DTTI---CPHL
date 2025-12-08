import { MOCK_USERS } from './constants';

const DB_KEY = 'sccphl_db';

const generateId = () => new Date().getTime() + Math.random();
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
const now = new Date();

// NOVA BASE DE DADOS INICIAL - ESTRUTURA LIMPA
const initialDb: { [key: string]: any[] } = {
    users: MOCK_USERS.map(u => ({ ...u })), 
    criminalidade: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), dataOcorrencia: randomDate(oneYearAgo, now).toISOString(), periodo: 'Noite', municipio: 'Lubango', unidadeEsquadra: '1ª Esquadra', numeroProcesso: 'PC2024/001', familiaCriminal: 'Crimes Contra o Património', crime: 'Roubo', modusOperandi: 'Arrombamento', nomeVitima: 'Ana Costa', nomeAcusado: 'Desconhecido', situacaoAcusado: 'Foragido', estadoProcesso: 'Em Investigação', bensRecuperados: 'Nenhum' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), dataOcorrencia: randomDate(oneYearAgo, now).toISOString(), periodo: 'Tarde', municipio: 'Matala', unidadeEsquadra: 'Comando Municipal', numeroProcesso: 'PC2024/002', familiaCriminal: 'Crimes Contra Pessoa', crime: 'Ofensa a Integridade Física', nomeVitima: 'Carlos Neves', nomeAcusado: 'Manuel Golias', situacaoAcusado: 'Detido', estadoProcesso: 'Remetido a Tribunal' },
    ],
    sinistralidade: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), dataAcidente: randomDate(oneYearAgo, now).toISOString(), periodo: 'Manhã', municipio: 'Lubango', local: 'Estrada da Tundavala', tipoAcidente: 'Colisão entre veículos', causaPresumivel: 'Excesso de velocidade', numeroVeiculos: 2, numeroVitimas: 3, numeroMortos: 1, numeroFeridosGraves: 1, numeroFeridosLigeiros: 1 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), dataAcidente: randomDate(oneYearAgo, now).toISOString(), periodo: 'Noite', municipio: 'Quilengues', local: 'EN-280', tipoAcidente: 'Despiste seguido de capotamento', causaPresumivel: 'Cansaço ou sonolência', numeroVeiculos: 1, numeroVitimas: 1, numeroMortos: 0, numeroFeridosGraves: 1, numeroFeridosLigeiros: 0 },
    ],
    enfrentamento: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Operação', data: randomDate(oneYearAgo, now).toISOString(), unidadeResponsavel: 'Comando Municipal', municipio: 'Lubango', nomeOperacao: 'Operação Stop', objetivoOperacao: 'Fiscalização de trânsito', resultadosOperacao: '2 viaturas apreendidas' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Patrulhamento', data: randomDate(oneYearAgo, now).toISOString(), unidadeResponsavel: '3ª Esquadra', municipio: 'Lubango', tipoPatrulhamento: 'Auto', areaPatrulhada: 'Bairro Comercial' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Detenção', data: randomDate(oneYearAgo, now).toISOString(), unidadeResponsavel: 'Investigação Criminal', municipio: 'Matala', nomeDetido: 'José Firmino', idadeDetido: 28, motivoDetencao: 'Furto qualificado' },
    ],
    transportes: [
        // Cadastro de Meios
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Cadastro de Meio', data: randomDate(oneYearAgo, now).toISOString(), matricula: 'HL-01-01-AA', marca: 'Toyota', modelo: 'Land Cruiser', tipoViatura: 'Ligeiro de Passageiros', estadoViatura: 'Operacional' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Cadastro de Meio', data: randomDate(oneYearAgo, now).toISOString(), matricula: 'HL-02-02-BB', marca: 'Nissan', modelo: 'Hardbody', tipoViatura: 'Ligeiro de Mercadorias', estadoViatura: 'Em Manutenção' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Cadastro de Meio', data: randomDate(oneYearAgo, now).toISOString(), matricula: 'HL-03-03-CC', marca: 'Hyundai', modelo: 'i10', tipoViatura: 'Ligeiro de Passageiros', estadoViatura: 'Inoperacional' },
    
        // Manutenções
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Manutenção', data: randomDate(oneYearAgo, now).toISOString(), viaturaMatricula: 'HL-02-02-BB', tipoManutencao: 'Corretiva', descricaoServico: 'Troca de pneus', custoManutencao: 150000 },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Manutenção', data: randomDate(oneYearAgo, now).toISOString(), viaturaMatricula: 'HL-01-01-AA', tipoManutencao: 'Preventiva', descricaoServico: 'Revisão dos 50.000km', custoManutencao: 75000 },
        
        // Abastecimentos
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Abastecimento', data: randomDate(oneYearAgo, now).toISOString(), viaturaMatricula: 'HL-01-01-AA', combustivel: 'Gasóleo', quantidadeLitros: 70, bombaCombustivel: 'Sonangol' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoRegisto: 'Abastecimento', data: randomDate(oneYearAgo, now).toISOString(), viaturaMatricula: 'HL-02-02-BB', combustivel: 'Gasóleo', quantidadeLitros: 65, bombaCombustivel: 'Pumangol' },
    ],
    // LOGÍSTICA FOI DIVIDIDA EM DUAS "TABELAS"
    efetivo: [
        { id: generateId(), createdAt: new Date().toISOString(), nip: '132257', nomeCompleto: 'Nilton Edgar Lamúrias Gourgel', patente: 'Inspector-Chefe', orgaoUnidade: 'Departamento de Telec. Tec. de Informação', funcao: 'Chefe de Departamento', dataNascimento: '1990-05-20', genero: 'Masculino', contacto: '923000000', estado: 'Ativo' },
        { id: generateId(), createdAt: new Date().toISOString(), nip: '112233', nomeCompleto: 'Ana Paula dos Santos', patente: 'Agente de 1ª Classe', orgaoUnidade: '1ª Esquadra', funcao: 'Agente de Patrulha', dataNascimento: '1995-10-15', genero: 'Feminino', contacto: '912000000', estado: 'Ativo' },
    ],
    material: [
        { id: generateId(), createdAt: new Date().toISOString(), tipoMaterial: 'Armamento', descricaoItem: 'Pistola Glock G19', quantidade: 1, estado: 'Bom', nipEfetivoResponsavel: '132257' },
        { id: generateId(), createdAt: new Date().toISOString(), tipoMaterial: 'Fardamento', descricaoItem: 'Farda de Trabalho (Calça e Camisa)', quantidade: 2, estado: 'Bom', nipEfetivoResponsavel: '112233' },
        { id: generateId(), createdAt: new Date().toISOString(), tipoMaterial: 'Comunicações', descricaoItem: 'Rádio HT Baofeng', quantidade: 1, estado: 'Razoável', nipEfetivoResponsavel: '112233', observacoes: 'Bateria com pouca autonomia' },
    ],
    autosExpediente: [
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Auto de Queixa', numeroAuto: 'AQ2024/001', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0], esquadra: '1ª Esquadra', agenteResponsavel: 'Agente Dias', noticianteNome: 'Maria da Conceição', queixadoNome: 'Indivíduo Desconhecido', descricaoFactos: 'Reportou o furto da sua carteira na via pública.' },
        { id: generateId(), createdAt: randomDate(oneYearAgo, now).toISOString(), tipoAuto: 'Auto de Apreensão', numeroAuto: 'AA2024/001', dataAuto: randomDate(oneYearAgo, now).toISOString().split('T')[0], esquadra: '2ª Esquadra', agenteResponsavel: 'Agente Bastos', noticianteNome: 'Carlos Alberto', descricaoFactos: 'Apreensão de material furtado (um telemóvel).' },
    ],
    // FIX: Added 'processos' table to the database for the new form.
    processos: [],
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