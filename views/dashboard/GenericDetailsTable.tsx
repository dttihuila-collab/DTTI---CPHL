
import React from 'react';
import { DataRecord } from '../../types';

const GenericDetailsTable: React.FC<{ records: DataRecord[], title?: string }> = ({ records, title }) => {
    const recentRecords = records.slice(0, 10);
    const headers = recentRecords.length > 0 ? Object.keys(recentRecords[0]) : [];

    return (
        <div className="overflow-x-auto">
            {title && <h4 className="text-lg font-semibold text-gray-700 mb-4">{title}</h4>}
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {headers.map(key => <th key={key} scope="col" className="px-6 py-3">{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {recentRecords.map(record => (
                        <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                            {headers.map(key => <td key={key} className="px-6 py-4 whitespace-nowrap">{String(record[key])}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenericDetailsTable;
