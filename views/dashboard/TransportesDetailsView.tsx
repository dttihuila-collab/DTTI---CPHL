import React, { useMemo } from 'react';
import { TransportesRecord } from '../../types';

const TransportesDetailsView: React.FC<{ records: TransportesRecord[] }> = React.memo(({ records }) => {

    const veiculos = useMemo(() => records.filter(r => r.tipoRegisto === 'Cadastro de Meio'), [records]);
    const manutencoes = useMemo(() => records.filter(r => r.tipoRegisto === 'Manutenção'), [records]);
    const abastecimentos = useMemo(() => records.filter(r => r.tipoRegisto === 'Abastecimento'), [records]);

    const veiculosOperacionais = useMemo(() => veiculos.filter(v => v.estadoViatura === 'Operacional').length, [veiculos]);
    const totalLitros = useMemo(() => abastecimentos.reduce((sum, r) => sum + (Number(r.quantidadeLitros) || 0), 0), [abastecimentos]);
    const custoManutencoes = useMemo(() => manutencoes.reduce((sum, r) => sum + (Number(r.custoManutencao) || 0), 0), [manutencoes]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Meios</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{veiculos.length} <span className="text-lg font-normal">({veiculosOperacionais} Operacionais)</span></p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Abastecido</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalLitros.toLocaleString()} L</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Custo de Manutenções</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{custoManutencoes.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Meios Registados</h4>
                     <ul className="divide-y dark:divide-gray-700">
                        {veiculos.slice(0,5).map(r => <li key={r.id} className="py-2 text-sm"><strong>{r.matricula}</strong><p className="text-xs text-gray-500">{r.marca} {r.modelo} ({r.estadoViatura})</p></li>)}
                     </ul>
                 </div>
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimas Manutenções</h4>
                     <ul className="divide-y dark:divide-gray-700">
                        {manutencoes.slice(0,5).map(r => <li key={r.id} className="py-2 text-sm"><strong>{r.viaturaMatricula}</strong> ({r.tipoManutencao})<p className="text-xs text-gray-500">{r.descricaoServico}</p></li>)}
                     </ul>
                 </div>
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                     <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Últimos Abastecimentos</h4>
                     <ul className="divide-y dark:divide-gray-700">
                        {abastecimentos.slice(0,5).map(r => <li key={r.id} className="py-2 text-sm"><strong>{r.viaturaMatricula}</strong>: {r.quantidadeLitros}L de {r.combustivel}</li>)}
                     </ul>
                 </div>
            </div>
        </div>
    );
});

export default TransportesDetailsView;