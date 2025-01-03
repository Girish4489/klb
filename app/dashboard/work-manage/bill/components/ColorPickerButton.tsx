'use client';
import { Modal } from '@components/Modal/Modal';
import colors, { basicColors } from '@data/colors';
import { IColor } from '@models/klm';
import React, { JSX, useEffect, useState } from 'react';

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

const formattedBasicColors: IColor[] = Object.entries(basicColors).map(([name, hex]) => ({
  type: 'Basic',
  name,
  hex,
}));

function ColorPickerButton({
  onColorSelect,
  modalId,
  selectedColor: initialSelectedColor,
  labelHtmlFor,
  inputId,
}: ColorPickerButtonProps): JSX.Element {
  const [selectedColor, setSelectedColor] = useState<IColor | null>(initialSelectedColor || null);

  useEffect(() => {
    setSelectedColor(initialSelectedColor || null);
  }, [initialSelectedColor]);

  const handleButtonClick = (): void => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedColor({ type: 'Custom', name: 'Custom', hex: event.target.value });
  };

  const handleColorSelect = (color: IColor): void => {
    setSelectedColor(color);
    onColorSelect(color);
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <React.Fragment>
      <button
        className="rounded-box border-base-content/50 bg-base-100 flex w-fit grow flex-col border p-2 max-sm:w-full"
        onClick={handleButtonClick}
      >
        <span className="label label-text flex w-full flex-row items-center justify-around gap-2 font-medium">
          <span className="text-nowrap">{selectedColor?.type === 'Custom' ? 'Custom' : 'Selected'} Color: </span>
          <span className="text-nowrap">
            {selectedColor?.type === 'Selected' && selectedColor?.name
              ? selectedColor?.name
                  .split(/(?=[A-Z])/)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : ''}
          </span>
        </span>
        <div className="badge badge-lg border-info h-8 w-full" style={{ backgroundColor: selectedColor?.hex }}></div>
      </button>

      <Modal id={modalId} isBackdrop={true} title="Select Color">
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
            <h2 className="label label-text">Basic Colors</h2>
            <div className="grid grid-cols-4 gap-2">
              {formattedBasicColors.map((color) => (
                <button
                  key={color.name}
                  className={`btn btn-sm m-1 h-11 grow flex-wrap justify-between text-wrap max-sm:h-fit ${
                    selectedColor?.name === color.name ? 'border-info border-2' : ''
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
          <div className="flex flex-col gap-1">
            <h2 className="label label-text">Color Picker</h2>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color.name}
                  className={`btn btn-sm m-1 h-11 grow flex-wrap justify-between text-wrap max-sm:h-fit ${
                    selectedColor?.name === color.name ? 'border-info border-2' : ''
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
      </Modal>
    </React.Fragment>
  );
}

export default ColorPickerButton;
