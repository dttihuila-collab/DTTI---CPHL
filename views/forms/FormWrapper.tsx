import React, { ReactNode } from 'react';
import { Button } from '../../components/common/FormElements';

interface FormWrapperProps {
    title: string;
    description: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
    isSubmitting?: boolean;
    onCancel?: () => void;
    submitButtonText?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = React.memo(({ title, description, onSubmit, children, isSubmitting = false, onCancel, submitButtonText = "Inserir" }) => {
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
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center space-x-3 rounded-b-lg">
                        {onCancel && (
                             <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                        )}
                        <Button type="submit" isLoading={isSubmitting}>
                            {submitButtonText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default FormWrapper;