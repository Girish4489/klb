import ColorPickerButton from '@/app/dashboard/work-manage/bill/components/ColorPickerButton';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { IBill, ICategory, IColor, IDimensionTypes, IDimensions, IStyle, IStyleProcess } from '@models/klm';
import { Types } from 'mongoose';
import React from 'react';
import { updateOrderAmount } from '../utils/billUtils';
import { InputField } from './InputField';

interface OrderDetailsProps {
  order: IBill['order'][number];
  orderIndex: number;
  bill: IBill;
  setBill: React.Dispatch<React.SetStateAction<IBill | undefined>>;
  category: ICategory[];
  handleRemoveOrder: (orderIndex: number) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  handleDimensionChange: (
    dimensionTypeName: string,
    dimensionName: string,
    note: string,
    orderIndex: number,
    dimIndex: number,
    dimLength: number,
  ) => Promise<void>;
  handleStyleProcessChange: (
    styleName: string,
    styleProcessName: string,
    orderIndex: number,
    styleProcessIndex: number,
    styleProcessLength: number,
  ) => Promise<void>;
  handleColorSelect: (color: IColor, orderIndex: number) => Promise<void>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  orderIndex,
  bill,
  setBill,
  category,
  handleRemoveOrder,
  handleDimensionChange,
  handleStyleProcessChange,
  handleColorSelect,
}) => {
  const handleCategoryChange = (
    selectedCategoryId: string | null,
    selectedCategoryName: string,
    orderIndex: number,
  ): void => {
    setBill((prevBill) => {
      if (!prevBill) return prevBill;
      const updatedOrder = [...prevBill.order];
      const newCategory = selectedCategoryId
        ? {
            catId: new Types.ObjectId(selectedCategoryId),
            categoryName: selectedCategoryName,
          }
        : undefined;

      updatedOrder[orderIndex] = {
        ...updatedOrder[orderIndex],
        category: newCategory,
        dimension: [],
        styleProcess: [],
      };

      return {
        ...prevBill,
        order: updatedOrder,
      } as IBill;
    });
  };

  return (
    <div
      id={`order_${orderIndex}`}
      className="rounded-box bg-base-100 ring-primary flex w-full justify-between gap-2 p-1 shadow-sm ring-2 max-sm:flex-wrap max-sm:justify-around"
    >
      <div className="rounded-box bg-base-300 ring-base-300 flex grow flex-col gap-1 p-2 shadow-sm ring-1">
        {/* 1st row */}
        <div className="flex w-full flex-row items-center justify-between gap-x-0.5 gap-y-2 max-sm:flex-col-reverse">
          <div className="flex w-full grow flex-row flex-wrap justify-start gap-x-1.5 gap-y-2">
            <InputField
              label="Sl No"
              id={`slNo_${orderIndex}`}
              type="text"
              value={orderIndex + 1}
              readOnly
              onChange={() => {}}
              className="w-fit"
              labelClass="max-w-28 text-nowrap"
              inputClass="grow"
            />
            <InputField
              label="Category"
              id={`category_${orderIndex}`}
              type="select"
              value={order.category?.categoryName || ''}
              onChange={(e) => {
                const selectedCategoryId = e.target.selectedOptions[0]?.getAttribute('data-itemid');
                const selectedCategoryName = e.target.value;
                handleCategoryChange(selectedCategoryId, selectedCategoryName, orderIndex);
              }}
              options={[
                { value: '', label: 'Select category' },
                ...category.map((cat) => ({
                  value: cat.categoryName || '',
                  label: cat.categoryName || '',
                  dataItemId: cat._id.toString(),
                })),
              ]}
            />
            <InputField
              label="Work"
              id={`work_${orderIndex}`}
              type="checkbox"
              value={order.work ?? false}
              onChange={(e) =>
                setBill({
                  ...bill,
                  order: bill.order?.map((o, i) =>
                    i === orderIndex ? { ...o, work: (e.target as HTMLInputElement).checked } : o,
                  ),
                } as IBill)
              }
              className=""
              labelClass="btn-neutral"
              checkboxClass="checkbox-primary"
            />
            <InputField
              label="Barcode"
              id={`barcode_${orderIndex}`}
              type="checkbox"
              value={order.barcode ?? false}
              onChange={(e) =>
                setBill({
                  ...bill,
                  order: bill.order?.map((o, i) =>
                    i === orderIndex ? { ...o, barcode: (e.target as HTMLInputElement).checked } : o,
                  ),
                } as IBill)
              }
              className=""
              labelClass="btn-neutral"
              checkboxClass="checkbox-primary"
            />
          </div>
          {/* remove specific order */}
          <div className="flex w-fit items-center px-2 max-sm:w-full">
            <button
              className="btn btn-secondary btn-xs flex select-none items-center font-bold"
              onClick={handleRemoveOrder(orderIndex)}
            >
              <MinusCircleIcon className="text-secondary-content h-5 w-5" />
              Remove
            </button>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-1 max-sm:flex-wrap">
          {/* 2nd row */}
          {category.map((cat) => {
            if (cat._id.toString() === bill?.order?.[orderIndex]?.category?.catId?.toString()) {
              return cat.dimensionTypes?.map((typ: IDimensionTypes, typIndex: number) => (
                <div
                  key={typIndex}
                  className="flex w-full flex-row flex-wrap items-center gap-1 max-sm:justify-between"
                >
                  <InputField
                    label={typ.dimensionTypeName}
                    id={`${typ.dimensionTypeName}_${orderIndex}_${typIndex}`}
                    type="select"
                    value={
                      typ.dimensions?.find((dim) => dim.dimensionName === order.dimension?.[typIndex]?.dimensionName)
                        ?.dimensionName ?? ''
                    }
                    onChange={(e) => {
                      const selectedDimensionTypeName = typ.dimensionTypeName;
                      handleDimensionChange(
                        selectedDimensionTypeName,
                        e.target.value,
                        order.dimension?.[typIndex]?.note ?? '',
                        orderIndex,
                        typIndex,
                        cat.dimensionTypes?.length ?? 0,
                      );
                    }}
                    options={[
                      { value: '', label: 'Select dimension' },
                      ...typ.dimensions.map((dim: IDimensions) => ({
                        value: dim.dimensionName,
                        label: dim.dimensionName,
                      })),
                    ]}
                  />
                  <InputField
                    label={`${typ.dimensionTypeName} Note`}
                    id={`${typ.dimensionTypeName}_note_${orderIndex}_${typIndex}`}
                    type="text"
                    value={order.dimension?.[typIndex]?.note || ''}
                    onChange={(e) => {
                      const selectedDimensionTypeName = typ.dimensionTypeName;
                      handleDimensionChange(
                        selectedDimensionTypeName,
                        order.dimension?.[typIndex]?.dimensionName ?? 'none',
                        e.target.value,
                        orderIndex,
                        typIndex,
                        cat.dimensionTypes?.length ?? 0,
                      );
                    }}
                  />
                </div>
              ));
            }
            return null;
          })}
        </div>
        <div className="flex flex-row justify-between">
          {/* 3rd row */}
          <div className="flex grow flex-row flex-wrap items-center gap-1 gap-x-1 gap-y-2 max-sm:flex-col">
            <span className="flex grow flex-col items-center gap-x-1 gap-y-2">
              <span className="flex w-full grow items-center gap-x-1">
                <ColorPickerButton
                  onColorSelect={(color) => {
                    handleColorSelect(color, orderIndex);
                  }}
                  modalId={`colorPickerBillModal_${orderIndex}`}
                  selectedColor={order.color}
                  labelHtmlFor={`colorPickerLabel_${orderIndex}`}
                  inputId={`colorPickerLabel_${orderIndex}`}
                />
                <InputField
                  label="Measure"
                  id={`measure_${orderIndex}`}
                  type="textarea"
                  placeholder="Enter measure here"
                  value={order.measurement || ''}
                  onChange={(e) =>
                    setBill({
                      ...bill,
                      order: bill.order?.map((o, i) => (i === orderIndex ? { ...o, measurement: e.target.value } : o)),
                    } as IBill)
                  }
                  className="rounded-box ring-base-100 w-full grow p-0.5 ring-1 max-sm:w-full"
                  labelClass="grow"
                  textareaClass="grow textarea textarea-primary bg-base-300 min-h-fit max-sm:w-full"
                />
              </span>
            </span>
            <span className="flex w-full grow items-center justify-between gap-x-1">
              <InputField
                label="Order Notes"
                id={`orderNotes_${orderIndex}`}
                type="text"
                placeholder="Enter order notes here"
                value={order.orderNotes || ''}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    order: bill.order?.map((o, i) => (i === orderIndex ? { ...o, orderNotes: e.target.value } : o)),
                  } as IBill)
                }
              />
              <InputField
                label="Amount"
                id={`amount_${orderIndex}`}
                type="number"
                placeholder="Enter amount here"
                value={order.amount || ''}
                onChange={(e) => {
                  const amount = parseFloat(e.currentTarget.value) || 0;
                  updateOrderAmount(bill, orderIndex, amount, setBill);
                }}
              />
            </span>
          </div>
        </div>
      </div>
      {/* style */}
      {category.some(
        (cat) =>
          cat._id.toString() === bill?.order?.[orderIndex]?.category?.catId?.toString() && cat.styleProcess?.length,
      ) && (
        <div className="rounded-box bg-base-300 ring-base-300 flex flex-col items-center gap-1 p-2 ring-1 max-sm:w-full max-sm:items-start">
          <h2 className="label label-text p-0 text-center">Style</h2>
          <div className="flex w-full flex-col flex-wrap justify-between gap-1 max-sm:flex-row">
            {(category || []).map((cat) => {
              if (cat._id.toString() === bill?.order?.[orderIndex]?.category?.catId?.toString()) {
                return cat.styleProcess?.map((styleProcess: IStyleProcess, styleProcessIndex: number) => (
                  <div
                    key={styleProcessIndex}
                    className="rounded-box bg-base-300 flex w-full flex-row flex-wrap items-center gap-1 p-2 max-sm:justify-between"
                  >
                    <InputField
                      label={styleProcess.styleProcessName}
                      id={`${styleProcess.styleProcessName}_${orderIndex}_${styleProcessIndex}`}
                      type="select"
                      value={
                        styleProcess.styles?.find(
                          (sty) => sty.styleName === order.styleProcess?.[styleProcessIndex]?.styleName,
                        )?.styleName ?? ''
                      }
                      onChange={(e) => {
                        handleStyleProcessChange(
                          e.target.value,
                          styleProcess.styleProcessName,
                          orderIndex,
                          styleProcessIndex,
                          cat.styleProcess?.length ?? 0,
                        );
                      }}
                      options={[
                        { value: '', label: 'Select style' },
                        ...styleProcess.styles.map((styles: IStyle) => ({
                          value: styles.styleName,
                          label: styles.styleName,
                        })),
                      ]}
                    />
                  </div>
                ));
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
