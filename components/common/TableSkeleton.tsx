import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    columns: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = React.memo(({ rows = 5, columns }) => {
    return (
        <>
            {[...Array(rows)].map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse border-b dark:border-gray-700">
                    {[...Array(columns)].map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
});