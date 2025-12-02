import { MOCK_USERS } from './constants';

const DB_KEY = 'sccphl_db';

const initialDb = {
    users: MOCK_USERS.map(u => ({ ...u })), // Deep copy to avoid mutation issues
    criminalidade: [],
    sinistralidade: [],
    resultados: [],
    transportes: [],
    logistica: [],
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
        return JSON.parse(serializedDb);
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
