import React from 'react';
import { DashboardCategory, View } from '../types';
import { AddIcon, ReportsIcon, MembersIcon, MunicipalityIcon, MaintenanceIcon, DocumentIcon } from '../components/icons/Icon';
import { TIPOS_AUTO_EXPEDIENTE } from '../constants';

interface ActionMenuViewProps {
  category: DashboardCategory;
  onNavigateToForm: (view: View) => void;
  onNavigateToReport: (category: DashboardCategory) => void;
  onNavigateToFormTab: (view: View, tab: string) => void;
  onNavigateToFormWithData: (view: View, data: any) => void;
}

const ActionCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void; small?: boolean }> = ({ title, icon, onClick, small = false }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 ${small ? 'p-4' : 'p-8'}`}
    >
        {icon}
        <h3 className={`font-semibold text-gray-800 dark:text-gray-200 ${small ? 'mt-3 text-md' : 'mt-4 text-xl'}`}>{title}</h3>
    </button>
);


const ActionMenuView: React.FC<ActionMenuViewProps> = ({ category, onNavigateToForm, onNavigateToReport, onNavigateToFormTab, onNavigateToFormWithData }) => {
    
    const renderTransportesMenu = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ActionCard
                title="Cadastrar Meio"
                icon={<MembersIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToFormTab('Transportes', 'Membros')}
            />
            <ActionCard
                title="Plano de Distribuição"
                icon={<MunicipalityIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToFormTab('Transportes', 'Municípios')}
            />
            <ActionCard
                title="Manutenções"
                icon={<MaintenanceIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToFormTab('Transportes', 'Manutenções')}
            />
            <ActionCard
                title="Consultar Registos"
                icon={<ReportsIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToReport(category)}
            />
        </div>
    );

    const renderAutosExpedienteMenu = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {TIPOS_AUTO_EXPEDIENTE.map(tipo => (
                 <ActionCard
                    key={tipo}
                    title={tipo}
                    icon={<DocumentIcon className="w-10 h-10 text-custom-blue-600 dark:text-custom-blue-400"/>}
                    onClick={() => onNavigateToFormWithData('Autos de Expediente', { tipoAuto: tipo })}
                    small
                />
            ))}
             <ActionCard
                title="Consultar Registos"
                icon={<ReportsIcon className="w-10 h-10 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToReport(category)}
                small
            />
        </div>
    );
    
    const renderDefaultMenu = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActionCard
                title="Registar Novo"
                icon={<AddIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToForm(category as View)}
            />
            <ActionCard
                title="Consultar Registos"
                icon={<ReportsIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToReport(category)}
            />
        </div>
    );
    
    const renderMenu = () => {
        switch(category) {
            case 'Transportes':
                return renderTransportesMenu();
            case 'Autos de Expediente':
                return renderAutosExpedienteMenu();
            default:
                return renderDefaultMenu();
        }
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
             <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{category}</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">O que pretende fazer?</p>
            </div>
            {renderMenu()}
        </div>
    );
};

export default ActionMenuView;