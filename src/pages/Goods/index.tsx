import { useEffect, useState } from 'react';
import GoodsItem from '../../components/goods/GoodsItem';
import type { GoodsItemType } from '../../types/Goods';

const Goods = () => {
  const [goodsList, setGoodsList] = useState<GoodsItemType[]>([]);

  useEffect(() => {
    // TODO: API 연결 후 수정 예정
    setGoodsList([
      { id: 1, name: '신라면', image: '/shinramen.png', stock: 10 },
      { id: 2, name: '물', image: '/water.png', stock: 5 },
    ]);
  }, []);

  // 예약하기 클릭
  const handleReserve = async (id: number) => {
    try {
      alert(`${id}번 물품 예약 완료!`);
    } catch (error) {
      console.error(error);
      alert('예약 실패!');
    }
  };

  return (
    <div className="p-4">
      {goodsList.map((goods) => (
        <GoodsItem
          key={goods.id}
          id={goods.id}
          name={goods.name}
          image={goods.image}
          stock={goods.stock}
          onReserve={handleReserve}
        />
      ))}
    </div>
  );
};

export default Goods;
