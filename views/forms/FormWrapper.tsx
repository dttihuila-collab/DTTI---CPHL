import React, { ReactNode } from 'react';
import { Button } from '../../components/common/FormElements';

interface FormWrapperProps {
    title: string;
    description: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ title, description, onSubmit, children }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="p-6 space-y-6">
                        {children}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 text-right rounded-b-lg">
                        <Button type="submit">
                            Inserir
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormWrapper;