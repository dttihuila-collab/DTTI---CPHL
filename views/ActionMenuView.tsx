import React from 'react';
import { DashboardCategory, View } from '../types';
import { AddIcon, ReportsIcon, MembersIcon, MunicipalityIcon, MaintenanceIcon, DocumentIcon, ArmamentIcon, ClothingIcon } from '../components/icons/Icon';
import { TIPOS_AUTO_EXPEDIENTE } from '../constants';

interface ActionMenuViewProps {
  category: DashboardCategory;
  onNavigateToForm: (view: View) => void;
  onNavigateToConsulta: (category: DashboardCategory) => void;
  onNavigateToFormTab: (view: View, tab: string) => void;
  onNavigateToFormWithData: (view: View, data: any) => void;
}

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClick: () => void;
  small?: boolean;
  variant?: 'default' | 'primary';
}

const ActionCard: React.FC<ActionCardProps> = ({ title, subtitle, icon, onClick, small = false, variant = 'default' }) => {
    // Base styles
    const baseClasses = `flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border`;
    const sizeClasses = small ? 'p-4' : 'p-8';

    // Variant-specific styles
    const variantClasses = variant === 'primary'
        ? 'bg-custom-blue-600 text-white border-transparent hover:bg-custom-blue-700'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    
    const titleClasses = variant === 'primary'
        ? 'text-white'
        : 'text-gray-800 dark:text-gray-200';

    // Handle icon color change for primary variant
    let finalIcon = icon;
    if (variant === 'primary') {
        const iconElement = icon as React.ReactElement;
        const existingClassName = iconElement.props.className || '';
        // Filter out any class starting with text- or dark:text-
        const classNameWithoutColor = existingClassName.split(' ').filter((cls: string) => !cls.startsWith('text-') && !cls.startsWith('dark:text-')).join(' ');
        finalIcon = React.cloneElement(iconElement, {
            className: `${classNameWithoutColor} text-white`
        });
    }
    
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
        >
            {finalIcon}
            <h3 className={`font-semibold ${titleClasses} ${small ? 'mt-3 text-md' : 'mt-4 text-xl'}`}>{title}</h3>
            {subtitle && <p className={`mt-1 text-sm ${variant === 'primary' ? 'text-blue-200' : 'text-custom-blue-600 dark:text-custom-blue-400'}`}>{subtitle}</p>}
        </button>
    );
};


const ActionMenuView: React.FC<ActionMenuViewProps> = ({ category, onNavigateToForm, onNavigateToConsulta, onNavigateToFormTab, onNavigateToFormWithData }) => {
    
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
                title="Consultas"
                icon={<ReportsIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToConsulta(category)}
                variant="primary"
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
                title="Consultas"
                icon={<ReportsIcon className="w-10 h-10 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToConsulta(category)}
                small
                variant="primary"
            />
        </div>
    );

    const renderLogisticaMenu = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ActionCard
                title="Armamento"
                icon={<ArmamentIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToFormTab('Logística', 'Armamento')}
            />
            <ActionCard
                title="Vestuário"
                icon={<ClothingIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToFormTab('Logística', 'Vestuário')}
            />
            <ActionCard
                title="Consultas"
                icon={<ReportsIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                onClick={() => onNavigateToConsulta(category)}
                variant="primary"
            />
        </div>
    );
    
    const renderDefaultMenu = () => {
        let registerTitle = "Registar Novo";
        let registerSubtitle: string | undefined = undefined;
        let consultTitle = "Consultas";
        
        if (category === 'Criminalidade') {
            registerTitle = "Nova Ocorrência";
            consultTitle = "Consultas";
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ActionCard
                    title={registerTitle}
                    subtitle={registerSubtitle}
                    icon={<AddIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                    onClick={() => onNavigateToForm(category as View)}
                />
                <ActionCard
                    title={consultTitle}
                    icon={<ReportsIcon className="w-12 h-12 text-custom-blue-600 dark:text-custom-blue-400"/>}
                    onClick={() => onNavigateToConsulta(category)}
                    variant="primary"
                />
            </div>
        );
    };
    
    const renderMenu = () => {
        switch(category) {
            case 'Transportes':
                return renderTransportesMenu();
            case 'Autos de Expediente':
                return renderAutosExpedienteMenu();
            case 'Logística':
                return renderLogisticaMenu();
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