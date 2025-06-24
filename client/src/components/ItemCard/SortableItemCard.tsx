import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type BaseItemCardProp, ItemCard } from "./ItemCard.tsx";

export const SortableItemCard = ({ item, toggleSelection, isSelected }: BaseItemCardProp) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ItemCard
      ref={setNodeRef}
      item={item}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-colors cursor-grab ${isDragging ? "bg-gray-900" : "bg-gray-800"}`}
    />
  );
};
