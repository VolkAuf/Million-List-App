import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchItems, postOrderedIndex } from "@/api/items.ts";
import type { Item } from "@/types/item.ts";

export const useItemsQuery = (query: string, limit = 20) => {
  const queryClient = useQueryClient();

  const result = useInfiniteQuery({
    queryKey: ["items", query],
    queryFn: ({ pageParam = 0 }) => fetchItems(pageParam, limit, query),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPageParam = allPages.reduce((acc, cur) => (acc += cur.items.length), 0);
      return lastPage.total === 0 ? undefined : nextPageParam;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const updateItemOrder = (newItems: Item[]) => {
    const prevData = result.data;

    queryClient.setQueryData(["items", query], () => {
      const newPages = [];
      for (let i = 0; i < newItems.length; i += limit) {
        const curItems = newItems.slice(i, i + limit);
        newPages.push({
          items: curItems,
          total: curItems.length,
        });
      }
      return { pages: newPages, pageParams: prevData?.pageParams ?? [] };
    });

    postOrderedIndex(
      newItems.map((i) => i.id),
      query.length > 0,
    ).catch(() => {
      queryClient.setQueryData(["items", query], prevData);
    });
  };

  return { ...result, updateItemOrder };
};
