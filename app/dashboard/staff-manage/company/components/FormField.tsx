import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  id,
  name,
  className,
}) => {
  return (
    <label className={`input input-sm input-primary flex items-center gap-2 ${className}`}>
      {label}:
      <input
        type={type}
        id={id}
        name={name}
        className="grow"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </label>
  );
};
