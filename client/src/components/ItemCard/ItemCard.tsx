import type { Item } from "@/types/item.ts";
import { forwardRef, type HTMLAttributes } from "react";

export type BaseItemCardProp = {
  item: Item;
  isSelected: (id: number) => boolean;
  toggleSelection: (id: number) => void;
};

type ItemCardProp = BaseItemCardProp & HTMLAttributes<HTMLDivElement>;

export const ItemCard = forwardRef<HTMLDivElement, ItemCardProp>(
  ({ item, toggleSelection, isSelected, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        {...rest}
        className={`flex items-center h-14 gap-2 p-3 mb-2 border rounded-md select-none ${className ?? ""}`}
      >
        <input type="checkbox" checked={isSelected(item.id)} onChange={() => toggleSelection(item.id)} />
        <p>Item {item.id}</p>
        <p>Item name {item.name}</p>
      </div>
    );
  },
);
