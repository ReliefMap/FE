import { useEffect, useState, useRef } from "react";

// window.kakao 타입 선언
declare global {
  interface Window {
    kakao?: any;
  }
}

const BottomSheet = ({
  open,
  onClose,
  locationName,
}: {
  open: boolean;
  onClose: () => void;
  locationName: string;
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY - startY.current;
    if (currentY.current > 0) {
      sheetRef.current!.style.transform = `translateY(${currentY.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (currentY.current > 100) {
      onClose();
    } else {
      sheetRef.current!.style.transform = `translateY(0px)`;
    }
    currentY.current = 0;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* 반투명 배경 */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div
        ref={sheetRef}
        className={`w-full bg-white rounded-t-2xl shadow-lg p-4 transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 드래그 핸들 */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* 장소명 */}
        <h2 className="text-lg font-semibold mb-4">{locationName}</h2>

        {/* 출발 / 도착 버튼 */}
        <div className="flex space-x-3 mb-4">
          <button className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium">
            출발
          </button>
          <button className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-medium">
            도착
          </button>
        </div>

        {/* 즐겨찾기 버튼 */}
        <div className="flex justify-around border-t pt-3">
          <button className="flex flex-col items-center text-gray-600">
            <span className="text-sm">즐겨찾기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !mapRef.current) return;

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 서울시청
      level: 4,
    });

    // 마커 생성
    const markerPosition = new kakao.maps.LatLng(37.5665, 126.978);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      map,
    });

    // 마커 클릭 이벤트 → 바텀시트 열기
    kakao.maps.event.addListener(marker, "click", () => {
      setLocationName("서울 시청");
      setOpen(true);
    });
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* 상단 바 */}
      <div className="absolute top-0 left-0 w-full h-16 p-4 z-10 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-xl font-semibold">재난지도</h1>
        <div className="flex gap-2">
          <button>⚙️</button>
          <button>🔍</button>
        </div>
      </div>

      {/* 지도 영역 */}
      <div ref={mapRef} className="absolute top-16 left-0 w-full bottom-16" />

      {/* 바텀시트 */}
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        locationName={locationName}
      />
    </div>
  );
}
