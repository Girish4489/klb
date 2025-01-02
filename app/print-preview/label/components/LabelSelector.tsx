import React from 'react';

export type LabelType = 'clothing' | 'folded';

interface LabelSelectorProps {
  selectedType: LabelType;
  onChange: (type: LabelType) => void;
}

const LabelSelector: React.FC<LabelSelectorProps> = ({ selectedType, onChange }) => {
  return (
    <div className="flex justify-center gap-4 p-2 print:hidden">
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          name="labelType"
          className="checkbox checkbox-primary checkbox-sm"
          checked={selectedType === 'clothing'}
          onChange={() => onChange('clothing')}
        />
        <span className="label-text">Clothing Label</span>
      </label>
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          name="labelType"
          className="checkbox checkbox-primary checkbox-sm"
          checked={selectedType === 'folded'}
          onChange={() => onChange('folded')}
        />
        <span className="label-text">Folded Label</span>
      </label>
    </div>
  );
};

export default LabelSelector;
