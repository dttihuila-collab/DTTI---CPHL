
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
import { api } from './services/api';

export const AuthContext = React.createContext<{
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}>({
  user: null,
  login: async () => false,
  logout: () => {},
});

const formViews: View[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];

const App: React.FC = () => {
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
        // If user tries to access a form they don't have permission for, default to Dashboard
        setCurrentView('Dashboard');
      }
    } else {
      setCurrentView(view);
    }
  }, [user]);

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Criminalidade':
        return <CriminalidadeForm />;
      case 'Sinistralidade Rodoviária':
        return <SinistralidadeForm />;
      case 'Resultados Policiais':
        return <ResultadosForm />;
      case 'Transportes':
        return <TransportesForm />;
      case 'Logística':
        return <LogisticaForm />;
      case 'Gerir Usuários':
        return <GerirUsuarios />;
      case 'Relatórios':
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          user={user}
          isCollapsed={isSidebarCollapsed}
          setCurrentView={handleSetCurrentView}
          currentView={currentView}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
            {renderView()}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;