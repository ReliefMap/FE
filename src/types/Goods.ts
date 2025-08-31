export type GoodsItemType = {
  id: number;
  name: string;
  image: string;
  stock: number;
};

export type GoodsItemProps = {
  id: number;
  name: string;
  image: string;
  stock: number;
  onReserve: (id: number) => void;
};

export type DateBarProps = {
  value?: { date?: string; time?: string };
  onOpen: () => void;
  onClear: () => void;
};
