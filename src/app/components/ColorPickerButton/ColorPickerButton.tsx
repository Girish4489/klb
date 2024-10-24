'use client';
import { IColor } from '@/models/klm';
import React, { useEffect, useState } from 'react';
import colors from '../../../../data/colors';

interface ColorPickerButtonProps {
  onColorSelect: (color: IColor) => void;
  modalId: string;
  selectedColor?: IColor;
  labelHtmlFor: string;
  inputId: string;
}

const predefinedColors: IColor[] = Object.entries(colors).map(([name, hex]) => ({
  type: 'Selected',
  name,
  hex,
}));

function ColorPickerButton({
  onColorSelect,
  modalId,
  selectedColor: initialSelectedColor,
  labelHtmlFor,
  inputId,
}: ColorPickerButtonProps) {
  const [selectedColor, setSelectedColor] = useState<IColor | null>(initialSelectedColor || null);

  useEffect(() => {
    setSelectedColor(initialSelectedColor || null);
  }, [initialSelectedColor]);

  const handleButtonClick = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor({ type: 'Custom', name: 'Custom', hex: event.target.value });
  };

  const handleColorSelect = (color: IColor) => {
    setSelectedColor(color);
    onColorSelect(color);
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <React.Fragment>
      <button className="max-w-32" onClick={handleButtonClick}>
        <span className="label label-text flex flex-wrap font-medium">
          {selectedColor?.type === 'Custom' ? 'Custom' : 'Selected'} Color:{' '}
          {selectedColor?.type === 'Selected' && selectedColor?.name
            ? selectedColor?.name
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : ''}
        </span>
        <div className="badge badge-lg h-10 w-full border-info" style={{ backgroundColor: selectedColor?.hex }} />
      </button>

      <dialog id={modalId} className="modal w-full border border-base-100">
        <div className="box-bordered modal-box w-5/6 min-w-24 max-w-full">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor={labelHtmlFor} className="label label-text">
                Custom Color
              </label>
              <div className="mask mask-squircle max-h-40 p-0">
                <input
                  type="color"
                  id={inputId}
                  name={modalId.split('_').join('')}
                  className="input min-h-40 w-full cursor-pointer border-0 p-0"
                  value={selectedColor?.hex || '#000000'}
                  onChange={handleColorPickerChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="label label-text">Color Picker</h2>
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color.name}
                    className={`btn btn-sm m-1 h-11 grow flex-wrap justify-between text-wrap max-sm:h-fit ${
                      selectedColor?.name === color.name ? 'border-2 border-info' : ''
                    }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color.name
                      .split(/(?=[A-Z])/)
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                    <div className="badge badge-lg h-8 w-20" style={{ backgroundColor: color.hex }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </React.Fragment>
  );
}

export default ColorPickerButton;
