import React, { useMemo } from 'react';
import { EfetivoRecord, MaterialRecord } from '../../types';

const LogisticaDetailsView: React.FC<{ records: (EfetivoRecord | MaterialRecord)[] }> = React.memo(({ records }) => {

    const efetivos = useMemo(() => records.filter((r): r is EfetivoRecord => 'nip' in r), [records]);
    const materiais = useMemo(() => records.filter((r): r is MaterialRecord => 'tipoMaterial' in r), [records]);
    
    const totalAtivos = useMemo(() => efetivos.filter(e => e.estado === 'Ativo').length, [efetivos]);
    const totalMaterial = useMemo(() => materiais.reduce((sum, m) => sum + (m.quantidade || 0), 0), [materiais]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400">Total de Efetivos</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{efetivos.length} ({totalAtivos} Ativos)</p></div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400">Total de Itens de Material</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalMaterial}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Efetivos Recentes</h4>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3 text-left">NIP</th>
                                    <th className="px-6 py-3 text-left">Nome</th>
                                    <th className="px-6 py-3 text-left">Patente</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {efetivos.slice(0, 5).map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 whitespace-nowrap">{r.nip}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.nomeCompleto}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.patente}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Material Recente</h4>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                         <table className="w-full text-sm">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3 text-left">Tipo</th>
                                    <th className="px-6 py-3 text-left">Descrição</th>
                                    <th className="px-6 py-3 text-left">Qtd</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {materiais.slice(0, 5).map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 whitespace-nowrap">{r.tipoMaterial}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.descricaoItem}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.quantidade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default LogisticaDetailsView;