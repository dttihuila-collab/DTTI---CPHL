
import { User, ApiKey, DataRecord } from '../types';
import { loadDatabase, saveDatabase } from '../database';

// Simulate a network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Security Enhancement: Password Hashing Simulation ---

const hashPassword = (password: string): string => {
    // In a real application, use a strong hashing algorithm like bcrypt.
    // Using base64 for demonstration purposes ONLY to show the pattern. It's not secure.
    try {
        return btoa(password);
    } catch (e) {
        console.error("Failed to hash password:", e);
        return password; // Fallback for environments where btoa might not be available
    }
};

const comparePassword = (password: string, hash: string): boolean => {
    // In a real application, bcrypt's compare function would handle this securely.
    try {
        return btoa(password) === hash;
    } catch (e) {
        return password === hash; // Fallback
    }
};

export const api = {
    // === AUTH ===
    login: async (username: string, password: string): Promise<User | null> => {
        await delay(300);
        const db = loadDatabase();
        const foundUser = db.users.find(u => u.name === username);
        
        if (foundUser && foundUser.passwordHash && comparePassword(password, foundUser.passwordHash)) {
            const { passwordHash, ...userToReturn } = foundUser;
            return userToReturn as User;
        }
        return null;
    },

    // === USER MANAGEMENT ===
    getUsers: async (): Promise<User[]> => {
        await delay(200);
        const db = loadDatabase();
        // Ensure password hashes are never sent to the client code.
        return db.users.map(u => {
            const { passwordHash, ...user } = u;
            return user as User;
        });
    },

    addUser: async (user: Omit<User, 'id'> & { password?: string }): Promise<User> => {
        await delay(400);
        const db = loadDatabase();
        const newId = Math.max(0, ...db.users.map(u => u.id || 0)) + 1;
        
        const { password, ...userData } = user;
        
        const newUser = { 
            ...userData, 
            id: newId,
            passwordHash: password ? hashPassword(password) : undefined
        };

        db.users.push(newUser);
        saveDatabase(db);
        
        const { passwordHash, ...userToReturn } = newUser;
        return userToReturn as User;
    },

    updateUser: async (updatedUser: User & { password?: string }): Promise<User | null> => {
        await delay(400);
        const db = loadDatabase();
        const userIndex = db.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex > -1) {
            const originalUser = db.users[userIndex];
            const { password, ...userData } = updatedUser;
            
            const userWithHash = { ...userData, passwordHash: originalUser.passwordHash };

            // If a new password is provided, hash it. Otherwise, keep the old hash.
            if (password && password.trim() !== '') {
                userWithHash.passwordHash = hashPassword(password);
            }

            db.users[userIndex] = userWithHash;
            saveDatabase(db);
            
            const { passwordHash, ...userToReturn } = db.users[userIndex];
            return userToReturn as User;
        }
        return null;
    },

    deleteUser: async (userId: number): Promise<boolean> => {
        await delay(500);
        const db = loadDatabase();
        const initialLength = db.users.length;
        db.users = db.users.filter(u => u.id !== userId);
        saveDatabase(db);
        return db.users.length < initialLength;
    },

    // === GENERIC RECORD MANAGEMENT ===
    getRecords: async (key: ApiKey): Promise<DataRecord[]> => {
        await delay(250);
        const db = loadDatabase();
        return db[key] || [];
    },

    addRecord: async (key: ApiKey, data: any): Promise<DataRecord> => {
        await delay(350);
        const db = loadDatabase();
        const newRecord: any = { 
            ...data, 
            id: new Date().getTime(),
            createdAt: new Date().toISOString() 
        };

        if (key === 'autosExpediente') {
            const records = db[key];
            const sigla = (data.tipoAuto || '')
                .split(' ')
                .map((word: string) => word.charAt(0))
                .join('')
                .toUpperCase();
            const ano = new Date().getFullYear();
            const count = records.filter((r: any) => r.numeroAuto && r.numeroAuto.startsWith(`${sigla}${ano}`)).length + 1;
            newRecord.numeroAuto = `${sigla}${ano}/${String(count).padStart(3, '0')}`;
        }

        db[key].push(newRecord);
        saveDatabase(db);
        return newRecord;
    },

    updateRecord: async (key: ApiKey, updatedRecord: DataRecord): Promise<DataRecord | null> => {
        await delay(300);
        const db = loadDatabase();
        const recordIndex = db[key].findIndex((r: DataRecord) => r.id === updatedRecord.id);
        if (recordIndex > -1) {
            db[key][recordIndex] = updatedRecord;
            saveDatabase(db);
            return updatedRecord;
        }
        return null;
    },
    
    deleteRecord: async (key: ApiKey, recordId: number): Promise<boolean> => {
        await delay(400);
        const db = loadDatabase();
        const initialLength = db[key].length;
        db[key] = db[key].filter((r: DataRecord) => r.id !== recordId);
        saveDatabase(db);
        return db[key].length < initialLength;
    }
};
