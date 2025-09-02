import { useEffect, useState } from 'react';
import GoodsItem from '../../components/goods/GoodsItem';
import type { GoodsItemType, TimeProps } from '../../types/Goods';
import DateBar from '../../components/goods/DateBar';
import DateSheet from '../../components/goods/DateSheet';
import { useLocation, useParams } from 'react-router-dom';
import Topbar from '../../layouts/Topbar';

const GoodsList = () => {
  /* TODO: API 요청 시 사용 예정 */
  const { storeId } = useParams();
  const location = useLocation();
  const storeName = (location.state as { name?: string })?.name;

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
    if (!time.date || !time.time) {
      alert('예약할 날짜와 시간을 선택해주세요!');
      return;
    }

    try {
      alert(`${id}번 물품 예약 완료!`);
    } catch (error) {
      console.error(error);
      alert('예약 실패!');
    }
  };

  return (
    <div className="w-full h-full pt-[60px] pb-16">
      <Topbar>
        <span className="ml-2 text-lg">{storeName} 물품 목록</span>
      </Topbar>
      <DateBar value={time} onOpen={() => setSheetOpen(true)} onClear={() => setTime({})} />
      <div className="p-4">
        {goodsList.map((goods) => (
          <GoodsItem
            key={goods.id}
            id={goods.id}
            name={goods.name}
            image={goods.image}
            stock={goods.stock}
            disabled={!time.date || !time.time}
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
    </div>
  );
};

export default GoodsList;
