import { type ReactNode, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type DraggableListProps<T> = {
  items: T[];
  getId: (item: T) => string | number;
  onReorder: (items: T[]) => void;
  onEndReached?: () => void;
  ItemRenderer: (index: number, item: T) => ReactNode;
  DragOverlayItemRenderer: (item: T) => ReactNode;
};

export const DraggableList = <T,>({
  items,
  getId,
  onReorder,
  onEndReached,
  ItemRenderer,
  DragOverlayItemRenderer,
}: DraggableListProps<T>) => {
  const [activeId, setActiveId] = useState<number | string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    onReorder(newItems);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
        <Virtuoso
          style={{ height: "800px", width: "100%", gap: "15px" }}
          className="border border-gray-300 rounded-md"
          totalCount={items.length}
          data={items}
          itemContent={ItemRenderer}
          endReached={onEndReached}
          increaseViewportBy={800}
        />
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeId ? DragOverlayItemRenderer(items.find((item) => getId(item) === activeId)!) : null}
      </DragOverlay>
    </DndContext>
  );
};
