export type Item = {
  id: string;
  name: string;
  type: string;
  got: boolean;
  missing: boolean;
  price?: number;
  quantity: number;
  weightInfo?: {
    pricePerKg: number;
    weight: number;
  };
};

export type ShoppingList = {
  id: string;
  title: string;
  date: string;
  items: Item[];
  totalSpent: number;
};