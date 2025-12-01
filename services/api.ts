
import { MOCK_USERS } from '../constants';
import { User } from '../types';

// Simulate a network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// In-memory data store, initialized with mock data
let db = {
    users: MOCK_USERS.map(u => ({ ...u })), // Deep copy to avoid mutation issues
    criminalidade: [],
    sinistralidade: [],
    resultados: [],
    transportes: [],
    logistica: [],
};

export const api = {
    // === AUTH ===
    login: async (username: string, password: string): Promise<User | null> => {
        await delay(300);
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
        // Return users without their passwords
        return db.users.map(u => {
            const { password, ...user } = u;
            return user as User;
        });
    },

    addUser: async (user: Omit<User, 'id'>): Promise<User> => {
        await delay(400);
        const newId = Math.max(0, ...db.users.map(u => u.id || 0)) + 1;
        const newUser = { ...user, id: newId };
        db.users.push(newUser);
        const { password, ...userToReturn } = newUser;
        return userToReturn as User;
    },

    updateUser: async (updatedUser: User): Promise<User | null> => {
        await delay(400);
        const userIndex = db.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex > -1) {
            const originalUser = db.users[userIndex];
            // Preserve original password if not provided in the update
            const password = updatedUser.password && updatedUser.password.trim() !== '' ? updatedUser.password : originalUser.password;
            
            db.users[userIndex] = { ...updatedUser, password };
            
            const { password: _, ...userToReturn } = db.users[userIndex];
            return userToReturn as User;
        }
        return null;
    },

    deleteUser: async (userId: number): Promise<boolean> => {
        await delay(500);
        const initialLength = db.users.length;
        db.users = db.users.filter(u => u.id !== userId);
        return db.users.length < initialLength;
    },

    // === GENERIC RECORD MANAGEMENT ===
    getRecords: async (key: keyof Omit<typeof db, 'users'>): Promise<any[]> => {
        await delay(250);
        return db[key] || [];
    },

    addRecord: async (key: keyof Omit<typeof db, 'users'>, data: any): Promise<any> => {
        await delay(350);
        const newRecord = { 
            ...data, 
            id: new Date().getTime(),
            createdAt: new Date().toISOString() 
        };
        db[key].push(newRecord);
        return newRecord;
    }
};
