import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../icons/Icon';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    titleClassName?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false, titleClassName = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const baseTitleClass = 'flex justify-between items-center w-full p-3 text-left font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600';

    return (
        <fieldset className="border-t pt-6 dark:border-gray-700">
            <legend className="w-full">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${baseTitleClass} ${titleClassName}`}
                    aria-expanded={isOpen}
                >
                    <span className="text-lg">{title}</span>
                    {isOpen ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
                </button>
            </legend>
            {isOpen && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </fieldset>
    );
};

export default React.memo(CollapsibleSection);
