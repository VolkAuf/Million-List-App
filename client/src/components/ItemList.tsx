import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { VList, type VListHandle } from "virtua";
import { fetchItems } from "../api/items.ts";
import type { Item } from "../types/item.ts";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  sortableKeyboardCoordinates,
} from "@dnd-kit/core";

export const ItemList = () => {
  const limit = 20;

  const [items, setItems] = useState<Item[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: async ({ pageParam = 0 }) => fetchItems(pageParam, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.total, 0);
      return lastPage.total === 0 ? loaded : undefined;
    },
  });

  /*const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
          .then((res) => {
            console.error("Загружена следующая страница:", res);
            if (res.data) {
              setItems((prev) => [...prev, ...res.data.pages.flatMap((p) => p.items)]);
            }
          })
          .catch((error) => {
            console.error("Ошибка при загрузке следующей страницы:", error);
          });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [observerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);*/

  /*return (
    <div className="p-4 max-w-xl mx-auto">
      {items
        .map((item) => (
          <div key={item.id} className="border rounded p-2 mb-1 bg-gray shadow-sm">
            {item.name}
          </div>
        ))}
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">Загрузка...</p>}
    </div>
  );*/

  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={useCallback((event) => {
        setActiveId(event.active.id);
      }, [])}
      onDragEnd={useCallback((event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
        setActiveId(null);
      }, [])}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <VList
          style={{
            width: 400,
            height: 600,
          }}
        >
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </VList>
      </SortableContext>
      <DragOverlay>{activeId != null ? <Item id={activeId} /> : null}</DragOverlay>
    </DndContext>
  );

  useEffect(() => {
    fetchNextPage()
      .then((res) => {
        console.error("Загружена следующая страница:", res);
        if (res.data) {
          setItems((prev) => [...prev, ...res.data.pages.flatMap((p) => p.items)]);
        }
      })
      .catch((error) => {
        console.error("Ошибка при загрузке следующей страницы:", error);
      });
  }, []);

  const ref = useRef<VListHandle>(null);
  const fetchedCountRef = useRef(-1);
  const count = items.length;
  return (
    <VList
      ref={ref}
      className={"flex-col gap-1"}
      onScroll={async () => {
        if (!ref.current) return;
        if (fetchedCountRef.current < count && ref.current.findEndIndex() + 50 > count) {
          fetchedCountRef.current = count;
          fetchNextPage()
            .then((res) => {
              console.error("Загружена следующая страница:", res);
              if (res.data) {
                setItems((prev) => [...prev, ...res.data.pages.flatMap((p) => p.items)]);
              }
            })
            .catch((error) => {
              console.error("Ошибка при загрузке следующей страницы:", error);
            });
        }
      }}
    >
      {items.map((item) => (
        <div key={item.id} className="text-2xl font-bold text-center py-4">
          {item.name}
        </div>
      ))}
      <div className="text-2xl font-bold text-center py-4">popa</div>
      {isFetchingNextPage && <p className="text-center">Загрузка...</p>}
    </VList>
  );
};
