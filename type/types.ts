export type Item = {
  id: string;
  name: string;
  type: string;
  got: boolean;
  missing: boolean;
  price?: number;
  quantity?: number;
};