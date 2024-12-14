import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  placeholder?: string;
  inputClassName?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  placeholder,
  inputClassName,
  onChange,
  required = false,
  readOnly = false,
}) => (
  <div className="flex grow flex-wrap items-center gap-1 max-sm:justify-between">
    <label htmlFor={id} className="input input-sm input-primary flex grow items-center gap-2 max-sm:text-nowrap">
      {label}:
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        className={`grow ${inputClassName}`}
        onChange={onChange}
        autoComplete="off"
        required={required}
        readOnly={readOnly}
      />
    </label>
  </div>
);

export default InputField;
