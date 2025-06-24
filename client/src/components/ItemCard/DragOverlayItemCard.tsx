import { type BaseItemCardProp, ItemCard } from "./ItemCard.tsx";

export const DragOverlayItemCard = ({ item, toggleSelection, isSelected }: BaseItemCardProp) => {
  return (
    <ItemCard
      item={item}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
      className={`cursor-grabbing bg-black text-white`}
    />
  );
};
