import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchSelectedIds, toggleItemSelection } from "@/api/items.ts";

export const useSelection = () => {
  const queryClient = useQueryClient();

  const { data: selectedIds = [] } = useQuery({
    queryKey: ["selectedIds"],
    queryFn: fetchSelectedIds,
  });

  const mutation = useMutation({
    mutationFn: toggleItemSelection,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["selectedIds"] });
      const previousSelected = queryClient.getQueryData<number[]>(["selectedIds"]);
      queryClient.setQueryData<number[]>(["selectedIds"], (old = []) =>
        old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
      );
      return { previousSelected };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSelected) {
        queryClient.setQueryData(["selectedIds"], context.previousSelected);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["selectedIds"] });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["selectedIds"] });
    },
  });

  const toggleSelection = useCallback(
    (id: number) => {
      mutation.mutate(id);
    },
    [mutation],
  );

  const isSelected = useCallback((id: number) => selectedIds.includes(id), [selectedIds]);

  return {
    isSelected,
    toggleSelection,
    isLoading: mutation.isPending,
  };
};
