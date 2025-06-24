import axios from "axios";
import type { Item } from "@/types/item";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

export const fetchItems = async (
  offset: number,
  limit: number,
  query: string = "",
): Promise<{ items: Item[]; total: number }> => {
  console.log(`start fetch offset: ${offset}; limit: ${limit}; query: ${query};`);
  const { data } = await API.get("/items", {
    params: { offset, limit, q: query },
  });
  return data;
};

export const fetchSelectedIds = async (): Promise<number[]> => {
  const { data } = await API.get("items/selected");
  return data.selectedIds;
};

export const toggleItemSelection = async (id: number) => {
  await API.post("/items/select", { id });
};

export const postOrderedIndex = async (orderedIndex: number[], isQuery: boolean) => {
  await API.post("/items/reorder", { ids: orderedIndex, isQuery });
};

export const refreshFilteredOrderedIndex = async () => {
  await API.post("/items/reorder", { ids: [], isQuery: true });
};
