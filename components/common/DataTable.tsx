import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons/Icon';
import { TableSkeleton } from './TableSkeleton';

export interface ColumnDef<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: any }> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  renderRowActions?: (row: T) => React.ReactNode;
}

const ITEMS_PER_PAGE = 10;

export const DataTable = React.memo(function DataTable<T extends { id: any }>({
  columns,
  data,
  isLoading = false,
  renderRowActions,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  const sortedData = useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);
  
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getColumnValue = (row: T, accessorKey: keyof T | string) => {
      return row[accessorKey as keyof T] as string;
  }

  return (
    <div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            {columns.map(column => (
                                <th key={String(column.accessorKey)} scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort(String(column.accessorKey))}>
                                    <div className="flex items-center">
                                        {column.header}
                                        <span className="ml-1">
                                            {sortConfig?.key === column.accessorKey ? (sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />) : <ChevronDownIcon className="text-gray-400/50"/>}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            {renderRowActions && <th scope="col" className="px-6 py-3 text-right">Ações</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {isLoading ? (
                            <TableSkeleton columns={columns.length + (renderRowActions ? 1 : 0)} />
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {columns.map(column => (
                                        <td key={String(column.accessorKey)} className="px-6 py-4 whitespace-nowrap">
                                            {column.cell ? column.cell(row) : String(getColumnValue(row, column.accessorKey))}
                                        </td>
                                    ))}
                                    {renderRowActions && (
                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                            {renderRowActions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhum registo encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {!isLoading && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Página {currentPage} de {totalPages}
                </span>
                <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                        <ChevronLeftIcon />
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="-ml-px px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}) as <T extends { id: any }>(props: DataTableProps<T>) => React.ReactElement;