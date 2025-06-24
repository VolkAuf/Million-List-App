import axios from "axios";
import type { Item } from "../types/item";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

export const fetchItems = async (
  offset: number,
  limit: number,
  query: string = "",
): Promise<{ items: Item[]; total: number }> => {
  const { data } = await API.get("/items", {
    params: { offset, limit, q: query },
  });
  return data;
};
