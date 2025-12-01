
import React, { useState } from 'react';
import { DashboardCategory } from '../types';

const TABS: DashboardCategory[] = ['Criminalidade', 'Sinistralidade Rodoviária', 'Resultados Policiais', 'Transportes', 'Logística'];

const Relatorios: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DashboardCategory>(TABS[0]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Relatórios</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-custom-blue-500 text-custom-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Relatórios de {activeTab}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Relatório Diário</h4>
                            <p className="text-gray-600">Conteúdo do relatório diário para {activeTab}.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Relatório Semanal</h4>
                            <p className="text-gray-600">Conteúdo do relatório semanal para {activeTab}.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Relatório Mensal</h4>
                            <p className="text-gray-600">Conteúdo do relatório mensal para {activeTab}.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Relatório Trimestral</h4>
                            <p className="text-gray-600">Conteúdo do relatório trimestral para {activeTab}.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Relatório Anual</h4>
                            <p className="text-gray-600">Conteúdo do relatório anual para {activeTab}.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Relatorios;
