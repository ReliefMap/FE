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
