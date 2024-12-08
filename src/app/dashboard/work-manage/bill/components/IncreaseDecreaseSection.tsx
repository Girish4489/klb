import { IBill } from '@/models/klm';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
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
    <div className="mx-2 flex h-fit flex-row gap-2 rounded-box bg-accent/15 px-2 py-1">
      <button className="btn btn-primary btn-xs select-none font-extrabold" onClick={handleNewOrder}>
        <PlusCircleIcon className="h-5 w-5 text-primary-content" />
        Add
      </button>
      {(bill?.order?.length ?? 0) > 0 && (
        <button
          className="btn btn-secondary btn-xs select-none font-extrabold"
          onClick={handleRemoveOrder((bill?.order?.length ?? 0) - 1)}
        >
          <MinusCircleIcon className="h-5 w-5 text-secondary-content" />
          Remove
        </button>
      )}
    </div>
  );
};

export default IncreaseDecreaseSection;
