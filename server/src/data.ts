export interface Item {
  id: number;
  name: string;
}

export const ITEMS: Item[] = Array.from({ length: 1_000_000 }, (_, i) => ({
  id: i + 1,
  name: `Item #${i + 1}`,
}));

export const ITEMS_LENGTH = ITEMS.length;

export const selectedIds = new Set<number>();
export let customOrder: number[] = [];

export const setCustomOrder = (ids: number[]) => {
  customOrder = ids;
};

export let customQueryOrder: number[] = [];

export const setCustomFilteredOrder = (ids: number[]) => {
  customQueryOrder = ids;
};
