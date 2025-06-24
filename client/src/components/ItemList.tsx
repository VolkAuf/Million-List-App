import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import { refreshFilteredOrderedIndex } from "@/api/items.ts";
import { useSelection } from "@/hooks/useSelection.ts";
import { useItemsQuery } from "@/hooks/useItemsQuery.ts";
import { DraggableList } from "@/components/DraggableList.tsx";
import { SortableItemCard, DragOverlayItemCard } from "@/components/ItemCard";

const COUNT_IN_PAGE_LIMIT = 20;

export const ItemList = () => {
  const [query, setQuery] = useState<string>("");
  const { isSelected, toggleSelection } = useSelection();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, updateItemOrder } = useItemsQuery(
    query,
    COUNT_IN_PAGE_LIMIT,
  );

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleQueryOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    refreshFilteredOrderedIndex();
    setQuery(e.target.value);
  };

  const itemRenderer = useCallback(
    (_: number, item: (typeof items)[number]) => (
      <SortableItemCard item={item} isSelected={isSelected} toggleSelection={toggleSelection} />
    ),
    [isSelected, toggleSelection],
  );

  const dragOverlayItemRenderer = useCallback(
    (item: (typeof items)[number]) => (
      <DragOverlayItemCard item={item} isSelected={isSelected} toggleSelection={toggleSelection} />
    ),
    [isSelected, toggleSelection],
  );

  return (
    <div className="w-full max-w-screen-md sm:w-[60%] min-w-[320px]">
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        placeholder="Поиск..."
        value={query}
        onChange={handleQueryOnChange}
      />
      <DraggableList
        items={items}
        getId={(item) => item.id}
        onReorder={updateItemOrder}
        onEndReached={handleEndReached}
        ItemRenderer={itemRenderer}
        DragOverlayItemRenderer={dragOverlayItemRenderer}
      />
    </div>
  );
};
