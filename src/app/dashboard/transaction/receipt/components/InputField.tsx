import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  type?: string;
  placeholder?: string;
  inputClassName?: string;
  required?: boolean;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  <label htmlFor={id} className="input input-sm input-primary max-sm:text-nowrap">
    <span className="label">{label}</span>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      placeholder={placeholder}
      className={`${inputClassName}`}
      onChange={onChange}
      autoComplete="off"
      required={required}
      readOnly={readOnly}
    />
  </label>
);

export default InputField;
