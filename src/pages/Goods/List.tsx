import { useEffect, useState } from 'react';
import GoodsItem from '../../components/goods/GoodsItem';
import type { GoodsItemType, TimeProps } from '../../types/Goods';
import DateBar from '../../components/goods/DateBar';
import DateSheet from '../../components/goods/DateSheet';

const GoodsList = () => {
  const [goodsList, setGoodsList] = useState<GoodsItemType[]>([]);
  const [time, setTime] = useState<TimeProps>({});
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    /* TODO: API 연결 후 수정 예정 */
    setGoodsList([
      { id: 1, name: '신라면', image: '/shinramen.png', stock: 10 },
      { id: 2, name: '물', image: '/water.png', stock: 5 },
    ]);
  }, []);

  const handleReserve = async (id: number) => {
    try {
      alert(`${id}번 물품 예약 완료!`);
    } catch (error) {
      console.error(error);
      alert('예약 실패!');
    }
  };

  return (
    <>
      <DateBar value={time} onOpen={() => setSheetOpen(true)} onClear={() => setTime({})} />
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
      <DateSheet
        open={sheetOpen}
        initial={time}
        onClose={() => setSheetOpen(false)}
        onApply={(t: TimeProps) => setTime(t)}
      />
    </>
  );
};

export default GoodsList;
