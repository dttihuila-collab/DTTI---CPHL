import React, { useState, useEffect, useMemo } from 'react';
import { Select, Input, Label } from './FormElements';

interface EditableSelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  options: string[];
  storageKey: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options: initialOptions,
  storageKey,
  required,
  disabled,
  error
}) => {
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    try {
      const storedOptions = localStorage.getItem(storageKey);
      if (storedOptions) {
        setCustomOptions(JSON.parse(storedOptions));
      } else {
        setCustomOptions([]); // Ensure it's an empty array if nothing is stored
      }
    } catch (e) {
      console.error(`Failed to load custom options for ${storageKey}`, e);
      setCustomOptions([]);
    }
  }, [storageKey]);

  const allOptions = useMemo(() => [...new Set([...initialOptions, ...customOptions])], [initialOptions, customOptions]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'add_new') {
      setIsAddingNew(true);
    } else {
      setIsAddingNew(false);
      onChange(e);
    }
  };

  const handleNewValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };
  
  const handleAddNewOption = () => {
    const trimmedValue = newValue.trim();
    if (trimmedValue) {
        if (!allOptions.includes(trimmedValue)) {
            const newCustomOptions = [...customOptions, trimmedValue];
            setCustomOptions(newCustomOptions);
            try {
                localStorage.setItem(storageKey, JSON.stringify(newCustomOptions));
            } catch (e) {
                console.error(`Failed to save custom options for ${storageKey}`, e);
            }
        }
      
        // Simulate a change event to update the form state in the parent
        const simulatedEvent = {
            target: { name, value: trimmedValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(simulatedEvent);
      
        setNewValue('');
        setIsAddingNew(false);
    } else {
        // If user clears the input and blurs, go back to select without changing value
        setIsAddingNew(false);
    }
  };


  const handleInputBlur = () => {
    handleAddNewOption();
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddNewOption();
      }
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {isAddingNew ? (
        <Input
          id={`${id}-new`}
          name={`${name}-new`}
          type="text"
          value={newValue}
          onChange={handleNewValueChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
          placeholder="Digite o novo valor e pressione Enter"
        />
      ) : (
        <Select
          id={id}
          name={name}
          value={value}
          onChange={handleSelectChange}
          required={required}
          disabled={disabled}
          error={error}
        >
          <option value="">Selecione</option>
          {allOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {!disabled && (
            <option value="add_new" className="font-bold text-custom-blue-600 dark:text-custom-blue-400 bg-gray-100 dark:bg-gray-600">
                Outra...
            </option>
          )}
        </Select>
      )}
    </div>
  );
};

export default React.memo(EditableSelect);