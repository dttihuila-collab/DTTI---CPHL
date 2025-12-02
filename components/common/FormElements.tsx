
import React from 'react';

const baseInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue-500 focus:border-custom-blue-500 sm:text-sm";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = (props) => {
    return <input {...props} className={`${baseInputClass} ${props.className}`} />;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}
export const Select: React.FC<SelectProps> = ({ children, ...props }) => {
    return <select {...props} className={`${baseInputClass} ${props.className}`}>{children}</select>;
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea: React.FC<TextareaProps> = (props) => {
    return <textarea {...props} rows={4} className={`${baseInputClass} ${props.className}`} />;
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}
export const Label: React.FC<LabelProps> = ({ children, ...props }) => {
    return <label {...props} className={`block text-sm font-medium text-gray-700 ${props.className}`}>{children}</label>;
};

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, ...props }) => {
    const baseButtonClass = "inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    let colorClass = 'bg-custom-blue-600 hover:bg-custom-blue-700 focus:ring-custom-blue-500';
    if (variant === 'secondary') {
        colorClass = 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white';
    } else if (variant === 'danger') {
        colorClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }

    return (
        <button {...props} disabled={props.disabled || isLoading} className={`${baseButtonClass} ${colorClass} ${props.className}`}>
            {isLoading ? <Spinner /> : children}
        </button>
    );
};
