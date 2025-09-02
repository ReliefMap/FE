import { useEffect, useMemo, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import '../../styles/CustomDaypicker.css';
import { ko } from 'date-fns/locale';
import type { DateSheetProps } from '../../types/Goods';

const buildTimeSlots = () => {
  const times: string[] = [];
  const push = (h: number, m: number) => times.push(`${h}:${m.toString().padStart(2, '0')}`);
  for (let h = 10; h <= 11; h++) for (let m = 0; m <= 30; m += 30) push(h, m); // 오전
  for (let h = 12; h <= 17; h++) for (let m = 0; m <= 30; m += 30) push(h, m); // 오후
  return times;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export default function DateSheet({ open, onClose, onApply, initial }: DateSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [opening, setOpening] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const lastY = useRef<number>(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initial?.date ? new Date(initial.date) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(initial?.time ?? '');
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(selectedDate ?? new Date()));
  const [dpKey, setDpKey] = useState(0); // DayPicker 강제 리렌더용 키

  const all = useMemo(buildTimeSlots, []);
  const am = all.filter((t) => Number(t.split(':')[0]) < 12);
  const pm = all.filter((t) => Number(t.split(':')[0]) >= 12);

  const isSameYMD = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const toDateAt = (base: Date, hm: string) => {
    const [h, m] = hm.split(':').map(Number);
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const now = new Date();
  const today0 = startOfToday();

  useEffect(() => {
    if (open) {
      setMounted(true);
      const t = setTimeout(() => setOpening(true), 30);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(t);
        document.body.style.overflow = prev;
      };
    } else if (mounted) {
      setOpening(false);
      const t = setTimeout(() => setMounted(false), 360);
      return () => clearTimeout(t);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleDismiss();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted]);

  useEffect(() => {
    setSelectedTime('');
  }, [selectedDate]);

  useEffect(() => {
    if (!open) return;
    const d = initial?.date ? new Date(initial.date) : undefined;
    setSelectedDate(d);
    setSelectedTime(initial?.time ?? '');
    setCurrentMonth(startOfMonth(d ?? new Date()));

    setDragY(0);
    setDragging(false);
  }, [open, initial?.date, initial?.time]);

  const handleDismiss = () => {
    onClose();
  };

  const handleConfirm = () => {
    const dateStr =
      selectedDate &&
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    onApply({ date: dateStr, time: selectedTime || undefined });
    handleDismiss();
  };

  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setDpKey((k) => k + 1);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const handleSelect = (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);

    const isOtherMonth =
      date.getFullYear() !== currentMonth.getFullYear() ||
      date.getMonth() !== currentMonth.getMonth();
    if (isOtherMonth) {
      setCurrentMonth(startOfMonth(date));
    }
  };

  const startDrag = (clientY: number) => {
    dragStartY.current = clientY;
    lastY.current = clientY;
    setDragging(true);
    panelRef.current?.style.setProperty('transition', 'none');
  };

  const moveDrag = (clientY: number) => {
    if (dragStartY.current == null) return;
    const dy = Math.max(0, clientY - dragStartY.current);
    lastY.current = clientY;
    setDragY(dy);
  };

  const endDrag = () => {
    if (dragStartY.current == null) return;
    const dy = Math.max(0, lastY.current - dragStartY.current);
    const shouldClose = dy > 80;
    panelRef.current?.style.removeProperty('transition');
    setDragging(false);
    setDragY(0);

    if (shouldClose) handleDismiss();
    dragStartY.current = null;
  };

  if (!mounted) return null;

  const panelTransform = !opening ? 'translate3d(0, 100%, 0)' : `translate3d(0, ${dragY}px, 0)`;

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex flex-col justify-end',
        'transition-opacity duration-300',
        opening ? 'opacity-100' : 'opacity-0',
        'will-change-opacity',
      ].join(' ')}
      onClick={(e) => e.target === e.currentTarget && handleDismiss()}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/10" />

      <div
        ref={panelRef}
        style={{
          transform: panelTransform,
          transition: dragging ? 'none' : 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
        className={[
          'relative w-full max-w-none mx-0',
          'bg-white rounded-t-2xl shadow-lg',
          'max-h-[85vh] flex flex-col',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-center pt-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => startDrag(e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
          onMouseMove={(e) => dragging && moveDrag(e.clientY)}
          onTouchMove={(e) => dragging && moveDrag(e.touches[0].clientY)}
          onMouseUp={endDrag}
          onMouseLeave={dragging ? endDrag : undefined}
          onTouchEnd={endDrag}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between px-8 py-5 border-b-2 shrink-0">
          <div className="font-semibold text-xl">예약 정보</div>
          <button className="text-gray-500 hover:text-gray-700" onClick={handleDismiss}>
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-8 pt-6">
            <div className="border-b p-4 min-h-[360px] flex items-center justify-center">
              <DayPicker
                key={dpKey}
                mode="single"
                locale={ko}
                selected={selectedDate}
                onSelect={handleSelect}
                showOutsideDays
                disabled={{ before: today0 }}
                captionLayout="label"
                className="mx-auto"
                month={currentMonth}
                onMonthChange={(m) => setCurrentMonth(startOfMonth(m))}
                formatters={{
                  formatCaption: (m) => `${m.getFullYear()}년 ${m.getMonth() + 1}월`,
                }}
                modifiersStyles={{
                  selected: { backgroundColor: '#111111', color: '#FFFFFF', borderRadius: '10px' },
                  outside: { color: '#9ca3af' },
                }}
              />
            </div>
          </div>

          <div className="px-8 pt-6 space-y-6 pb-4">
            <section>
              <div className="text-sm text-gray-500 mb-3">오전</div>
              <div className="grid grid-cols-3 gap-4">
                {am.map((t) => {
                  const disabledByDate = !selectedDate;
                  const disabledByTime =
                    selectedDate &&
                    isSameYMD(selectedDate, now) &&
                    toDateAt(selectedDate, t) <= now;
                  const disabled = disabledByDate || !!disabledByTime;
                  return (
                    <button
                      key={t}
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedTime(t)}
                      className={[
                        'rounded-lg py-2 text-sm transition border text-center select-none',
                        disabled
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                          : selectedTime === t
                          ? 'bg-black text-white border-black hover:bg-black'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50',
                      ].join(' ')}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="pb-2">
              <div className="text-sm text-gray-500 mb-3">오후</div>
              <div className="grid grid-cols-3 gap-4">
                {pm.map((t) => {
                  const disabledByDate = !selectedDate;
                  const disabledByTime =
                    selectedDate &&
                    isSameYMD(selectedDate, now) &&
                    toDateAt(selectedDate, t) <= now;
                  const disabled = disabledByDate || !!disabledByTime;
                  return (
                    <button
                      key={t}
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedTime(t)}
                      className={[
                        'rounded-lg py-2 text-sm transition border text-center select-none',
                        disabled
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                          : selectedTime === t
                          ? 'bg-black text-white border-black hover:bg-black'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50',
                      ].join(' ')}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 flex gap-4 border-t shrink-0">
          <button className="flex-1 py-3 rounded-lg border" onClick={handleReset}>
            초기화
          </button>
          <button
            className="flex-1 py-3 rounded-lg bg-black text-white disabled:opacity-40"
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
