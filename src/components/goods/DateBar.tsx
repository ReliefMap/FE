import { FiCalendar, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import type { DateBarProps } from '../../types/Goods';

const DateBar = ({ value, onOpen, onClear }: DateBarProps) => {
  const hasValue = !!(value?.date || value?.time);
  const label = hasValue
    ? [value?.date, value?.time].filter(Boolean).join(' ') || '날짜, 시간으로 검색'
    : '날짜, 시간으로 검색';

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 w-full">
        <button
          onClick={onOpen}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-white text-sm w-full
                     shadow-sm hover:bg-gray-50"
        >
          <FiCalendar className="shrink-0" />
          <span className={`truncate ${hasValue ? 'text-gray-900' : 'text-gray-500'}`}>
            {label}
          </span>
          <FiChevronDown className="ml-auto shrink-0 text-gray-500 w-5 h-5" />
        </button>

        {hasValue && (
          <button
            onClick={onClear}
            className="shrink-0 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            title="필터 초기화"
          >
            <FiRefreshCw /> 초기화
          </button>
        )}
      </div>
    </div>
  );
};

export default DateBar;
