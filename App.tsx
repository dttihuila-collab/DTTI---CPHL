import React, { useState, useCallback, useMemo } from 'react';
import { User, View, Role, DashboardCategory } from './types';
import Login from './views/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import CriminalidadeForm from './views/forms/CriminalidadeForm';
import SinistralidadeForm from './views/forms/SinistralidadeForm';
import ResultadosForm from './views/forms/ResultadosForm';
import TransportesForm from './views/forms/TransportesForm';
import LogisticaForm from './views/forms/LogisticaForm';
import AutosExpedienteForm from './views/forms/AutosExpedienteForm';
import ProcessosForm from './views/forms/ProcessosForm';
import GerirUsuarios from './views/GerirUsuarios';
import Relatorios from './views/Relatorios';
import DatabaseSetup from './views/DatabaseSetup';
import ActionMenuView from './views/ActionMenuView';
import ConsultaView from './views/ConsultaView';
import { api } from './services/api';
import { AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { DataRefreshProvider } from './contexts/DataRefreshContext';
import { ThemeProvider } from './contexts/ThemeContext';

const formViews: View[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Operacionais', 'Transportes', 'Logística', 'Autos de Expediente', 'Processos'];

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [actionMenuCategory, setActionMenuCategory] = useState<DashboardCategory | null>(null);
  const [consultaCategory, setConsultaCategory] = useState<DashboardCategory | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<DashboardCategory | null>(null);
  const [initialFormData, setInitialFormData] = useState<any | null>(null);

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
    if (user?.role === Role.Padrao && (formViews.includes(view) || view === 'Relatórios' || view === 'Gerir Usuários' || view === 'Database Setup')) {
      if (user.permissions?.includes(view) || (view === 'Relatórios' && user.permissions?.some(p => formViews.includes(p)))) {
        setCurrentView(view);
      } else {
        setCurrentView('Dashboard');
      }
    } else {
      setCurrentView(view);
    }
    setActionMenuCategory(null);
    setConsultaCategory(null);
    setInitialFormData(null);
    if (view !== 'Relatórios') {
        setActiveReportTab(null);
    }
  }, [user]);

  const handleOpenActionMenu = useCallback((category: DashboardCategory) => {
    setCurrentView('ActionMenu');
    setActionMenuCategory(category);
  }, []);

  const handleNavigateToConsulta = useCallback((category: DashboardCategory) => {
    setCurrentView('Consulta');
    setConsultaCategory(category);
  }, []);

  const handleNavigateToFormWithData = useCallback((view: View, data: any) => {
      setCurrentView(view);
      setInitialFormData(data);
  }, []);

  if (!user) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <Login />
      </AuthContext.Provider>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
        case 'Dashboard': return <Dashboard />;
        case 'ActionMenu': 
            if (actionMenuCategory) {
                return <ActionMenuView 
                          category={actionMenuCategory} 
                          onNavigateToForm={handleSetCurrentView} 
                          onNavigateToConsulta={handleNavigateToConsulta}
                          onNavigateToFormWithData={handleNavigateToFormWithData}
                       />;
            }
            return <Dashboard />; // Fallback if no category
        case 'Consulta':
            if (consultaCategory) {
                return <ConsultaView 
                          category={consultaCategory}
                          onBack={() => handleOpenActionMenu(consultaCategory)}
                          onRegisterNew={(data) => handleNavigateToFormWithData(consultaCategory as View, data)}
                       />;
            }
             return <Dashboard />; // Fallback if no category
        case 'Criminalidade': return <CriminalidadeForm onCancel={() => handleOpenActionMenu('Criminalidade')} />;
        case 'Sinistralidade Rodoviária': return <SinistralidadeForm onCancel={() => handleOpenActionMenu('Sinistralidade Rodoviária')} />;
        case 'Resultados Operacionais': return <ResultadosForm onCancel={() => handleOpenActionMenu('Resultados Operacionais')} />;
        case 'Transportes': return <TransportesForm onCancel={() => handleOpenActionMenu('Transportes')} />;
        case 'Logística': return <LogisticaForm onCancel={() => handleOpenActionMenu('Logística')} />;
        case 'Autos de Expediente': return <AutosExpedienteForm initialData={initialFormData} onCancel={() => handleOpenActionMenu('Autos de Expediente')} />;
        case 'Processos': return <ProcessosForm onCancel={() => handleOpenActionMenu('Processos')} />;
        case 'Gerir Usuários': return <GerirUsuarios />;
        case 'Relatórios': return <Relatorios initialTab={activeReportTab} />;
        case 'Database Setup': return <DatabaseSetup />;
        default: return <Dashboard />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          user={user}
          isCollapsed={isSidebarCollapsed}
          setCurrentView={handleSetCurrentView}
          openActionMenu={handleOpenActionMenu}
          currentView={currentView}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
            {renderCurrentView()}
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