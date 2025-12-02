// FIX: Imported ApiKey type to resolve reference error.
import { User, ApiKey } from '../types';
import { loadDatabase, saveDatabase } from '../database';

// Simulate a network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
    // === AUTH ===
    login: async (username: string, password: string): Promise<User | null> => {
        await delay(300);
        const db = loadDatabase();
        const foundUser = db.users.find(u => u.name === username && u.password === password);
        if (foundUser) {
            const { password, ...userToReturn } = foundUser;
            return userToReturn as User;
        }
        return null;
    },

    // === USER MANAGEMENT ===
    getUsers: async (): Promise<User[]> => {
        await delay(200);
        const db = loadDatabase();
        // Return users without their passwords
        return db.users.map(u => {
            const { password, ...user } = u;
            return user as User;
        });
    },

    addUser: async (user: Omit<User, 'id'>): Promise<User> => {
        await delay(400);
        const db = loadDatabase();
        const newId = Math.max(0, ...db.users.map(u => u.id || 0)) + 1;
        const newUser = { ...user, id: newId };
        db.users.push(newUser);
        saveDatabase(db);
        const { password, ...userToReturn } = newUser;
        return userToReturn as User;
    },

    updateUser: async (updatedUser: User): Promise<User | null> => {
        await delay(400);
        const db = loadDatabase();
        const userIndex = db.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex > -1) {
            const originalUser = db.users[userIndex];
            // Preserve original password if not provided in the update
            const password = updatedUser.password && updatedUser.password.trim() !== '' ? updatedUser.password : originalUser.password;
            
            db.users[userIndex] = { ...updatedUser, password };
            saveDatabase(db);
            
            const { password: _, ...userToReturn } = db.users[userIndex];
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
    // FIX: Replaced `keyof Omit<typeof db, 'users'>` with `ApiKey` to fix "Cannot find name 'db'" error.
    getRecords: async (key: ApiKey): Promise<any[]> => {
        await delay(250);
        const db = loadDatabase();
        return db[key] || [];
    },

    // FIX: Replaced `keyof Omit<typeof db, 'users'>` with `ApiKey` to fix "Cannot find name 'db'" error.
    addRecord: async (key: ApiKey, data: any): Promise<any> => {
        await delay(350);
        const db = loadDatabase();
        const newRecord = { 
            ...data, 
            id: new Date().getTime(),
            createdAt: new Date().toISOString() 
        };
        db[key].push(newRecord);
        saveDatabase(db);
        return newRecord;
    }
};