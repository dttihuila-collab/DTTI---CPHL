import { User, ApiKey, DataRecord } from '../types';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Ocorreu um erro desconhecido.' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const api = {
    // === AUTH ===
    login: async (username: string, password: string): Promise<User | null> => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            return response.json();
        }
        return null; // Login failed
    },

    // === USER MANAGEMENT ===
    getUsers: async (): Promise<User[]> => {
        const response = await fetch('/api/users');
        return handleResponse(response);
    },

    addUser: async (user: Omit<User, 'id'>): Promise<User> => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return handleResponse(response);
    },

    updateUser: async (updatedUser: User): Promise<User | null> => {
         const response = await fetch(`/api/users?id=${updatedUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
        });
        return handleResponse(response);
    },

    deleteUser: async (userId: number): Promise<boolean> => {
        const response = await fetch(`/api/users?id=${userId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return true;
        }
        throw new Error('Falha ao eliminar o usuário.');
    },

    // === GENERIC RECORD MANAGEMENT ===
    getRecords: async (key: ApiKey): Promise<DataRecord[]> => {
        const response = await fetch(`/api/records/${key}`);
        return handleResponse(response);
    },

    addRecord: async (key: ApiKey, data: any): Promise<DataRecord> => {
        const response = await fetch(`/api/records/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updateRecord: async (key: ApiKey, updatedRecord: DataRecord): Promise<DataRecord | null> => {
        const response = await fetch(`/api/records/${key}?id=${updatedRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecord),
        });
        return handleResponse(response);
    },
    
    deleteRecord: async (key: ApiKey, recordId: number): Promise<boolean> => {
        const response = await fetch(`/api/records/${key}?id=${recordId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return true;
        }
        throw new Error('Falha ao eliminar o registo.');
    }
};
