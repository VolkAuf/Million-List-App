import { Request, Response } from "express";
import {
  customFilteredOrder,
  customOrder,
  Item,
  ITEMS,
  ITEMS_LENGTH,
  selectedIds,
  setCustomFilteredOrder,
  setCustomOrder,
} from "@/data";

const getFilteredItems = (needCount: number, query: string) => {
  if (!query) {
    return ITEMS.slice(0, needCount);
  }

  const filteredItems: Item[] = [];
  let items: Item[] = ITEMS;

  for (let i = 0; filteredItems.length < needCount && i < items.length; i++) {
    if (items[i].name.toLowerCase().includes(query)) {
      filteredItems.push(items[i]);
    }
  }

  return filteredItems;
};

const isValidId = (id: number): boolean => {
  return id >= 1 && id <= ITEMS_LENGTH;
};

export const getItem = async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = Math.min(parseInt(req.query.offset as string) || 0);
  const pageEnd = offset + limit;

  if (pageEnd > ITEMS.length) {
    res.status(200).json({ items: [], total: 0 });
    return;
  }

  const query = (req.query.q as string)?.toLowerCase() || "";
  let orderItems = query ? customFilteredOrder : customOrder;
  let filteredItems = getFilteredItems(Math.max(orderItems.length, pageEnd), query);

  if (orderItems?.length > 0 && orderItems.length >= pageEnd) {
    filteredItems = filteredItems.sort((a, b) => orderItems.indexOf(a.id) - orderItems.indexOf(b.id));
  }

  const page = filteredItems.slice(offset, pageEnd);
  res.status(200).json({ items: page, total: page.length });
};

export const postSelectById = async (req: Request, res: Response) => {
  const { id } = req.body as { id: number };

  if (!isValidId(id)) {
    res.status(400).json({ error: "Invalid ID range" });
    return;
  }

  if (selectedIds.has(id)) {
    selectedIds.delete(id);
  } else {
    selectedIds.add(id);
  }

  res.status(200).json({ success: true, selectedCount: selectedIds.size });
};

export const getSelected = async (_: Request, res: Response) => {
  res.status(200).json({ selectedIds: Array.from(selectedIds) });
};

export const postReorderItems = async (req: Request, res: Response) => {
  const { ids, isQuery } = req.body as { ids: number[]; isQuery: boolean };

  if (!Array.isArray(ids) || !ids.every(Number.isInteger)) {
    res.status(400).json({ error: "Invalid id array" });
    return;
  }

  setCustomFilteredOrder([]);
  isQuery ? setCustomFilteredOrder(ids) : setCustomOrder(ids);
  res.status(200).json({ success: true });
};
