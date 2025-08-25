export type Item = {
  id: string;
  name: string;
  type: string;
  got: boolean;
  missing: boolean;
  price?: number;
  quantity?: number;
};

export type ShoppingList = {
  id: string;
  date: string;
  items: Item[];
  totalSpent: number;
};