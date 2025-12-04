import React, { useMemo } from 'react';
import { EnfrentamentoRecord } from '../../types';

const EnfrentamentoDetailsView: React.FC<{ records: EnfrentamentoRecord[] }> = React.memo(({ records }) => {

    const operacoes = useMemo(() => records.filter(r => r.tipoRegisto === 'Operação'), [records]);
    const patrulhamentos = useMemo(() => records.filter(r => r.tipoRegisto === 'Patrulhamento'), [records]);
    const detidos = useMemo(() => records.filter(r => r.tipoRegisto === 'Detenção'), [records]);

    const recordsByCategory = {
        'Operações': operacoes,
        'Patrulhamentos': patrulhamentos,
        'Detidos': detidos
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['Operações', 'Patrulhamentos', 'Detidos'] as const).map(cat => {
                    const total = recordsByCategory[cat].length;
                    return (
                        <div key={cat} className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-center">
                            <h4 className="font-semibold text-gray-600 dark:text-gray-300">{cat}</h4>
                            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{total}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimas Operações</h4>
                     <ul className="divide-y dark:divide-gray-700">
                        {operacoes.slice(0,5).map(r => <li key={r.id} className="py-2 text-sm"><strong>{r.nomeOperacao}</strong><p className="text-xs text-gray-500">{r.municipio}</p></li>)}
                     </ul>
                 </div>
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Patrulhamentos</h4>
                     <ul className="divide-y dark:divide-gray-700">
                        {patrulhamentos.slice(0,5).map(r => <li key={r.id} className="py-2 text-sm"><strong>{r.tipoPatrulhamento}</strong> em {r.areaPatrulhada}<p className="text-xs text-gray-500">{r.municipio}</p></li>)}
                     </ul>
                 </div>
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimas Detenções</h4>
                     <ul className="divide-y dark:divide-gray-700">
                        {detidos.slice(0,5).map(r => <li key={r.id} className="py-2 text-sm"><strong>{r.nomeDetido}</strong><p className="text-xs text-gray-500">{r.motivoDetencao}</p></li>)}
                     </ul>
                 </div>
            </div>
        </div>
    );
});

export default EnfrentamentoDetailsView;