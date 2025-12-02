// IMPORTANT: This is a simple in-memory database for demonstration purposes.
// In a Vercel serverless environment, this data will reset on each deployment
// and may reset on new serverless function instances.
// For true persistence, a real database like Vercel Postgres, Vercel KV, or another provider is required.

import { MOCK_USERS } from '../constants';
// FIX: Removed 'Omit' from import as it's a built-in TypeScript utility type.
import { DataRecord, User, ApiKey } from '../types';

const generateId = () => new Date().getTime() + Math.floor(Math.random() * 1000);

// Initialize the database in memory
const db: { [key: string]: any[] } = {
    users: MOCK_USERS.map(u => ({ ...u, id: u.id ?? generateId() })),
    criminalidade: [
        { id: generateId(), createdAt: new Date('2023-10-26T10:00:00Z').toISOString(), familiaDeletiva: 'Crimes Contra o Património', crime: 'Roubo', data: '2023-10-26T08:30', periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '1ª Esquadra', vitimaNome: 'Ana Costa', acusadoNome: 'Desconhecido' },
        { id: generateId(), createdAt: new Date('2023-10-25T15:20:00Z').toISOString(), familiaDeletiva: 'Crimes Contra Pessoa', crime: 'Ofensa a Integridade Física', data: '2023-10-25T14:00', periodo: 'IIº', municipio: 'Matala', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'Carlos Neves', acusadoNome: 'Manuel Golias' },
        { id: generateId(), createdAt: new Date('2023-10-24T22:10:00Z').toISOString(), familiaDeletiva: 'Crimes Contra o Património', crime: 'Furto', data: '2023-10-24T21:00', periodo: 'IIIº', municipio: 'Humpata', unidadeEsquadra: '2ª Esquadra', vitimaNome: 'Empresa Agricola XYZ', acusadoNome: 'Desconhecido' },
        { id: generateId(), createdAt: new Date('2023-10-23T11:05:00Z').toISOString(), familiaDeletiva: 'Crimes Contra Pessoa', crime: 'Ameaça', data: '2023-10-23T10:45', periodo: 'Iº', municipio: 'Lubango', unidadeEsquadra: '3ª Esquadra', vitimaNome: 'Sofia Pinto', acusadoNome: 'António Lopes' },
        { id: generateId(), createdAt: new Date('2023-10-22T18:00:00Z').toISOString(), familiaDeletiva: 'Crimes Contra Ordem e Tranquilidade Pública', crime: 'Posse Ilegal de arma de fogo', data: '2023-10-22T17:30', periodo: 'IIº', municipio: 'Chibia', unidadeEsquadra: 'Comando Municipal', vitimaNome: 'N/A', acusadoNome: 'Pedro Chivukuvuku' },
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
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', agenteNome: 'Agente Barros', tipoArmamento: 'Pistola', numSerieArma: '987654', estadoArma: 'Operacional' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Armamento', agenteNome: 'Agente Santos', tipoArmamento: 'AKM', numSerieArma: '123456', estadoArma: 'Operacional' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Viveres', descViveres: 'Arroz 25kg', qtdViveres: 100, unidadeViveres: 'Comando Municipal' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Viveres', descViveres: 'Água Mineral 1.5L', qtdViveres: 500, unidadeViveres: 'Comando Municipal' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuario', tipoVestuario: 'Botas', qtdVestuario: 20, estadoVestuario: 'Operacional' },
        { id: generateId(), createdAt: new Date().toISOString(), categoriaLogistica: 'Vestuario', tipoVestuario: 'Farda de Trabalho', qtdVestuario: 50, estadoVestuario: 'Operacional' },
    ],
};

// === DB ACCESS FUNCTIONS ===

// AUTH
export const findUserByCredentials = (username: string, password?: string): User | null => {
    const foundUser = db.users.find(u => u.name === username && u.password === password);
    if (foundUser) {
        const { password, ...userToReturn } = foundUser;
        return userToReturn as User;
    }
    return null;
}

// USERS
export const getUsers = (): User[] => {
    return db.users.map(u => {
        const { password, ...user } = u;
        return user as User;
    });
}

export const addUser = (user: Omit<User, 'id'>): User => {
    const newId = generateId();
    const newUser = { ...user, id: newId };
    db.users.push(newUser);
    const { password, ...userToReturn } = newUser;
    return userToReturn as User;
}

export const updateUser = (updatedUser: User): User | null => {
    const userIndex = db.users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
        const originalUser = db.users[userIndex];
        const password = updatedUser.password && updatedUser.password.trim() !== '' ? updatedUser.password : originalUser.password;
        db.users[userIndex] = { ...updatedUser, password };
        const { password: _, ...userToReturn } = db.users[userIndex];
        return userToReturn as User;
    }
    return null;
}

export const deleteUser = (userId: number): boolean => {
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== userId);
    return db.users.length < initialLength;
}


// RECORDS
export const getRecords = (key: ApiKey): DataRecord[] => {
    return db[key] || [];
}

export const addRecord = (key: ApiKey, data: any): DataRecord => {
    const newRecord = { 
        ...data, 
        id: generateId(),
        createdAt: new Date().toISOString() 
    };
    db[key].push(newRecord);
    return newRecord;
}

export const deleteRecord = (key: ApiKey, recordId: number): boolean => {
    const initialLength = db[key].length;
    db[key] = db[key].filter((r: DataRecord) => r.id !== recordId);
    return db[key].length < initialLength;
}