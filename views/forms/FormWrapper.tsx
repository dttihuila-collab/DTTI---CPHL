

import React, { ReactNode } from 'react';
import { Button } from '../../components/common/FormElements';

interface FormWrapperProps {
    title: string;
    description: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
    isSubmitting?: boolean;
}

const FormWrapper: React.FC<FormWrapperProps> = React.memo(({ title, description, onSubmit, children, isSubmitting = false }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="p-6 space-y-6">
                        {children}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-right rounded-b-lg">
                        <Button type="submit" isLoading={isSubmitting}>
                            Inserir
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default FormWrapper;