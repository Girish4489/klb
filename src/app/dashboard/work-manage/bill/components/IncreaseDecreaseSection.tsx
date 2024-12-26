import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { IBill } from '@models/klm';
import React from 'react';

interface IncreaseDecreaseSectionProps {
  bill: IBill;
  handleNewOrder: () => void;
  handleRemoveOrder: (orderIndex: number) => React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const IncreaseDecreaseSection: React.FC<IncreaseDecreaseSectionProps> = React.memo(
  ({ bill, handleNewOrder, handleRemoveOrder }) => {
    const orderCount = bill?.order?.length ?? 0;
    const canRemove = orderCount > 0;

    return (
      <div
        className="rounded-box bg-accent/15 mx-2 flex h-fit flex-row gap-2 p-2"
        role="toolbar"
        aria-label="Order management"
      >
        <button
          className="btn btn-primary btn-outline btn-xs select-none font-extrabold"
          onClick={handleNewOrder}
          aria-label="Add new order"
          type="button"
        >
          <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
          Add
        </button>
        {canRemove && (
          <button
            className="btn btn-secondary btn-outline btn-xs select-none font-extrabold"
            onClick={handleRemoveOrder(orderCount - 1)}
            aria-label="Remove last order"
            type="button"
          >
            <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
            Remove
          </button>
        )}
      </div>
    );
  },
);

IncreaseDecreaseSection.displayName = 'IncreaseDecreaseSection';

export default IncreaseDecreaseSection;
