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

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseButtonClass = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    let colorClass = 'bg-custom-blue-600 hover:bg-custom-blue-700 focus:ring-custom-blue-500';
    if (variant === 'secondary') {
        colorClass = 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white';
    } else if (variant === 'danger') {
        colorClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }

    return (
        <button {...props} className={`${baseButtonClass} ${colorClass} ${props.className}`}>
            {children}
        </button>
    );
};