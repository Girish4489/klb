import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { IBill } from '@models/klm';
import React from 'react';

interface IncreaseDecreaseSectionProps {
  bill: IBill;
  handleNewOrder: () => void;
  handleRemoveOrder: (orderIndex: number) => React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const IncreaseDecreaseSection: React.FC<IncreaseDecreaseSectionProps> = ({
  bill,
  handleNewOrder,
  handleRemoveOrder,
}) => {
  return (
    <div className="rounded-box bg-accent/15 mx-2 flex h-fit flex-row gap-2 px-2 py-1">
      <button className="btn btn-primary btn-xs select-none font-extrabold" onClick={handleNewOrder}>
        <PlusCircleIcon className="text-primary-content h-5 w-5" />
        Add
      </button>
      {(bill?.order?.length ?? 0) > 0 && (
        <button
          className="btn btn-secondary btn-xs select-none font-extrabold"
          onClick={handleRemoveOrder((bill?.order?.length ?? 0) - 1)}
        >
          <MinusCircleIcon className="text-secondary-content h-5 w-5" />
          Remove
        </button>
      )}
    </div>
  );
};

export default IncreaseDecreaseSection;
