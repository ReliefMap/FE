import type { GoodsItemProps } from '../../types/Goods';

const GoodsItem = ({ id, name, image, stock, disabled, onReserve }: GoodsItemProps) => {
  return (
    <div className="w-full rounded-2xl shadow p-4 mb-4 bg-white">
      <div className="flex gap-4">
        <img src={image} alt={name} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-lg">{name}</h2>
          </div>
          <p className="text-sm text-gray-600">잔여 수량 : {stock}개</p>
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={() => onReserve(id)}
          disabled={stock <= 0}
          className={`w-full rounded-lg py-2 font-medium ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          예약하기
        </button>
      </div>
    </div>
  );
};

export default GoodsItem;
