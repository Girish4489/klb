import React from 'react';

interface BaseInputFieldProps {
  label: string;
  id: string;
  className?: string;
  labelClass?: string;
}

interface TextInputFieldProps extends BaseInputFieldProps {
  type: 'text' | 'number' | 'email' | 'tel';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoComplete?: string;
  inputClass?: string;
}

interface CheckboxInputFieldProps extends BaseInputFieldProps {
  type: 'checkbox';
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkboxClass?: string;
}

interface SelectOption {
  value: string;
  label: string;
  dataItemId?: string;
}

interface SelectInputFieldProps extends BaseInputFieldProps {
  type: 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  selectClass?: string;
}

interface DateInputFieldProps extends BaseInputFieldProps {
  type: 'date';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoComplete?: string;
  dateClass?: string;
}

interface TextAreaInputFieldProps extends BaseInputFieldProps {
  type: 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoComplete?: string;
  textareaClass?: string;
}

const TextInput: React.FC<TextInputFieldProps> = ({
  id,
  value,
  onChange,
  placeholder,
  readOnly,
  autoComplete,
  className,
  label,
  labelClass,
  inputClass,
}) => (
  <div className={`flex select-none items-center ${className}`}>
    <label htmlFor={id} className={`input input-sm label-text input-bordered flex items-center gap-2 ${labelClass}`}>
      {label}:
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={`${inputClass}`}
      />
    </label>
  </div>
);

const CheckboxInput: React.FC<CheckboxInputFieldProps> = ({
  id,
  value,
  onChange,
  className,
  label,
  labelClass,
  checkboxClass,
}) => (
  <div className={`flex select-none items-center rounded-box max-sm:w-full max-sm:justify-between ${className}`}>
    <label htmlFor={id} className={`btn btn-sm flex h-full items-center gap-2 ${labelClass}`}>
      {label}
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={value}
        onChange={onChange}
        className={`checkbox checkbox-sm ${checkboxClass}`}
      />
    </label>
  </div>
);

const SelectInput: React.FC<SelectInputFieldProps> = ({
  id,
  value,
  onChange,
  options,
  className,
  label,
  labelClass,
  selectClass,
}) => (
  <div className={`flex select-none items-center gap-1 ${className}`}>
    <label htmlFor={id} className={`flex items-center ${labelClass}`}>
      {label}:
    </label>
    <select id={id} name={id} value={value} onChange={onChange} className={`select select-sm max-w-sm ${selectClass}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value} data-itemid={option.dataItemId}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const DateInput: React.FC<DateInputFieldProps> = ({
  id,
  value,
  onChange,
  placeholder,
  readOnly,
  autoComplete,
  className,
  label,
  labelClass,
  dateClass,
}) => (
  <div className={`flex select-none items-center text-center ${className}`}>
    <label htmlFor={id} className={`input input-sm label-text input-bordered flex gap-2 ${labelClass}`}>
      {label}:
      <input
        type="date"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={` ${dateClass}`}
      />
    </label>
  </div>
);

const TextAreaInput: React.FC<TextAreaInputFieldProps> = ({
  id,
  value,
  onChange,
  placeholder,
  readOnly,
  autoComplete,
  className,
  label,
  labelClass,
  textareaClass,
}) => (
  <div className={`flex items-center ${className}`}>
    <label
      htmlFor={id}
      className={`field-sizing-content textarea textarea-bordered textarea-sm flex items-center gap-1 ${labelClass}`}
    >
      {label}:
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={`px-2 py-1 ${textareaClass}`}
      />
    </label>
  </div>
);

export { CheckboxInput, DateInput, InputField, SelectInput, TextInput };
type InputFieldProps =
  | TextInputFieldProps
  | CheckboxInputFieldProps
  | SelectInputFieldProps
  | DateInputFieldProps
  | TextAreaInputFieldProps;

const InputField: React.FC<InputFieldProps> = (props) => {
  switch (props.type) {
    case 'text':
    case 'number':
    case 'email':
    case 'tel':
      return <TextInput {...props} />;
    case 'checkbox':
      return <CheckboxInput {...props} />;
    case 'select':
      return <SelectInput {...props} />;
    case 'date':
      return <DateInput {...props} />;
    case 'textarea':
      return <TextAreaInput {...props} />;
    default:
      return null;
  }
};
