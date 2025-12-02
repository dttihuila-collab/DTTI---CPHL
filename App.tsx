import React, { useState, useCallback, useMemo } from 'react';
import { User, View, Role } from './types';
import Login from './views/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import CriminalidadeForm from './views/forms/CriminalidadeForm';
import SinistralidadeForm from './views/forms/SinistralidadeForm';
import ResultadosForm from './views/forms/ResultadosForm';
import TransportesForm from './views/forms/TransportesForm';
import LogisticaForm from './views/forms/LogisticaForm';
import GerirUsuarios from './views/GerirUsuarios';
import Relatorios from './views/Relatorios';
import DatabaseSetup from './views/DatabaseSetup';
import { api } from './services/api';
import { AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { DataRefreshProvider } from './contexts/DataRefreshContext';
import { ThemeProvider } from './contexts/ThemeContext';

const formViews: View[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais', 'Transportes', 'Logística'];

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('Dashboard');

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const foundUser = await api.login(username, password);
    if (foundUser) {
        setUser(foundUser);
        setCurrentView('Dashboard');
        return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prevState => !prevState);
  }, []);

  const handleSetCurrentView = useCallback((view: View) => {
    if (user?.role === Role.Padrao && formViews.includes(view)) {
      if (user.permissions?.includes(view)) {
        setCurrentView(view);
      } else {
        setCurrentView('Dashboard');
      }
    } else {
      setCurrentView(view);
    }
  }, [user]);

  if (!user) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          user={user}
          isCollapsed={isSidebarCollapsed}
          setCurrentView={handleSetCurrentView}
          currentView={currentView}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
            {currentView === 'Dashboard' && <Dashboard />}
            {currentView === 'Criminalidade' && <CriminalidadeForm />}
            {currentView === 'Sinistralidade Rodoviária' && <SinistralidadeForm />}
            {currentView === 'Resultados Operacionais' && <ResultadosForm />}
            {currentView === 'Transportes' && <TransportesForm />}
            {currentView === 'Logística' && <LogisticaForm />}
            {currentView === 'Gerir Usuários' && <GerirUsuarios />}
            {currentView === 'Relatórios' && <Relatorios />}
            {currentView === 'Database Setup' && <DatabaseSetup />}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DataRefreshProvider>
        <ToastProvider>
          <AppContent />
          <ToastContainer />
        </ToastProvider>
      </DataRefreshProvider>
    </ThemeProvider>
  );
};

export default App;