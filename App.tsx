import React, { useState, useCallback, useMemo } from 'react';
import { User, View, Role, DashboardCategory, Subsystem } from './types';
import Login from './views/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import CriminalidadeForm from './views/forms/CriminalidadeForm';
import SinistralidadeForm from './views/forms/SinistralidadeForm';
import EnfrentamentoForm from './views/forms/ResultadosForm';
import TransportesForm from './views/forms/TransportesForm';
import LogisticaForm from './views/forms/LogisticaForm';
import AutosExpedienteForm from './views/forms/AutosExpedienteForm';
import ProcessosForm from './views/forms/ProcessosForm';
import GerirUsuarios from './views/GerirUsuarios';
import ConsultaOcorrencias from './views/Relatorios';
import DatabaseSetup from './views/DatabaseSetup';
import ActionMenuView from './views/ActionMenuView';
import ConsultaView from './views/ConsultaView';
import { api } from './services/api';
import { AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import { DataRefreshProvider } from './contexts/DataRefreshContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SubsystemSelection from './views/SubsystemSelection';
import { CrimeIcon, SinistralidadeIcon, PoliceIcon } from './components/icons/Icon';

// Nova Vista para o menu de registo de ocorrências
const RegistarOcorrenciaView: React.FC<{ onNavigateToForm: (view: View) => void }> = ({ onNavigateToForm }) => (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Registar Nova Ocorrência</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Selecione o tipo de ocorrência que pretende registar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['Criminalidade', 'Sinistralidade Rodoviária', 'Enfrentamento Policial'] as const).map(type => {
                const icon = {
                    'Criminalidade': <CrimeIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>,
                    'Sinistralidade Rodoviária': <SinistralidadeIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>,
                    'Enfrentamento Policial': <PoliceIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>,
                }[type];

                return (
                    <button
                        key={type}
                        onClick={() => onNavigateToForm(type)}
                        className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center space-y-4"
                    >
                        {icon}
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{type}</h3>
                    </button>
                );
            })}
        </div>
    </div>
);

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<Subsystem | null>(null);
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
        return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedSubsystem(null);
    setCurrentView('Dashboard');
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  const handleSelectSubsystem = useCallback((subsystem: Subsystem) => {
      setSelectedSubsystem(subsystem);
      if (subsystem === 'Administração do Sistema') {
          setCurrentView('Gerir Usuários');
      } else {
          setCurrentView('Dashboard');
      }
  }, []);

  const handleGoToSubsystemSelection = useCallback(() => {
      setSelectedSubsystem(null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prevState => !prevState);
  }, []);

  const handleSetCurrentView = useCallback((view: View) => {
    setCurrentView(view);
    setActionMenuCategory(null);
    setConsultaCategory(null);
    setInitialFormData(null);
    if (view !== 'Relatórios' && view !== 'Consultar Ocorrências') {
        setActiveReportTab(null);
    }
  }, []);

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

  if (!selectedSubsystem) {
    return (
      <AuthContext.Provider value={authContextValue}>
        <SubsystemSelection onSelectSubsystem={handleSelectSubsystem} />
      </AuthContext.Provider>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
        case 'Dashboard': return <Dashboard subsystem={selectedSubsystem} />;
        case 'Registar Ocorrência': return <RegistarOcorrenciaView onNavigateToForm={handleSetCurrentView} />;
        case 'Consultar Ocorrências': return <ConsultaOcorrencias />;
        case 'ActionMenu': 
            if (actionMenuCategory) {
                return <ActionMenuView 
                          category={actionMenuCategory} 
                          onNavigateToForm={handleSetCurrentView} 
                          onNavigateToConsulta={handleNavigateToConsulta}
                          onNavigateToFormWithData={handleNavigateToFormWithData}
                       />;
            }
            return <Dashboard subsystem={selectedSubsystem} />; // Fallback if no category
        case 'Consulta':
            if (consultaCategory) {
                return <ConsultaView 
                          category={consultaCategory}
                          onBack={() => handleOpenActionMenu(consultaCategory)}
                          onRegisterNew={() => handleNavigateToFormWithData(consultaCategory as View, {})}
                       />;
            }
             return <Dashboard subsystem={selectedSubsystem} />; // Fallback if no category
        case 'Criminalidade': return <CriminalidadeForm onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Sinistralidade Rodoviária': return <SinistralidadeForm onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Enfrentamento Policial': return <EnfrentamentoForm onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Transportes': return <TransportesForm initialData={initialFormData} onCancel={() => handleOpenActionMenu('Transportes')} />;
        case 'Logística': return <LogisticaForm onCancel={() => handleOpenActionMenu('Logística')} />;
        
        // Autos de Expediente direct navigation
        case 'Auto de Queixa': return <AutosExpedienteForm initialData={{ tipoAuto: 'Auto de Queixa' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Auto de Apreensão': return <AutosExpedienteForm initialData={{ tipoAuto: 'Auto de Apreensão' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Auto de Notícia': return <AutosExpedienteForm initialData={{ tipoAuto: 'Auto de Notícia' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Aviso de Notificação': return <AutosExpedienteForm initialData={{ tipoAuto: 'Aviso de Notificação' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Informação': return <AutosExpedienteForm initialData={{ tipoAuto: 'Informação' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Participação': return <AutosExpedienteForm initialData={{ tipoAuto: 'Participação' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Apresentação': return <AutosExpedienteForm initialData={{ tipoAuto: 'Apresentação' }} onCancel={() => handleSetCurrentView('Dashboard')} />;
        case 'Processos': return <ProcessosForm onCancel={() => handleSetCurrentView('Dashboard')} />;
        
        case 'Gerir Usuários': return <GerirUsuarios />;
        case 'Relatórios': 
            if (selectedSubsystem === 'Autos de Expedientes') {
                return <ConsultaView category="Autos de Expediente" onBack={() => handleSetCurrentView('Dashboard')} onRegisterNew={() => handleSetCurrentView('Auto de Queixa')} />;
            }
            return <ConsultaOcorrencias />; // Temporarily pointing to new one, can be improved later
        case 'Database Setup': return <DatabaseSetup />;
        default: return <Dashboard subsystem={selectedSubsystem} />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          user={user}
          subsystem={selectedSubsystem}
          isCollapsed={isSidebarCollapsed}
          setCurrentView={handleSetCurrentView}
          openActionMenu={handleOpenActionMenu}
          currentView={currentView}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} subsystemName={selectedSubsystem} onGoHome={handleGoToSubsystemSelection} />
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