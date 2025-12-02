import React from 'react';
import { DataRecord } from '../../types';

const GenericDetailsTable: React.FC<{ records: DataRecord[], title?: string }> = React.memo(({ records, title }) => {
    const recentRecords = records.slice(0, 10);
    const headers = recentRecords.length > 0 ? Object.keys(recentRecords[0]) : [];

    return (
        <div>
            {title && <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h4>}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                {headers.map(key => <th key={key} scope="col" className="px-6 py-3">{key}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {recentRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {headers.map(key => <td key={key} className="px-6 py-4 whitespace-nowrap">{String(record[key])}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

export default GenericDetailsTable;