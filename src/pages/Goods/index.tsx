import { useEffect, useState, useRef } from "react";
import { Filter } from "lucide-react";

declare global {
  interface Window {
    kakao?: any;
  }
}

/* 장소 정보 바텀시트 */
const BottomSheet = ({
  open,
  onClose,
  locationName,
}: {
  open: boolean;
  onClose: () => void;
  locationName: string;
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`w-full bg-white rounded-t-2xl shadow-lg p-4 transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-4">{locationName}</h2>
      </div>
    </div>
  );
};

/* 필터 선택 바텀시트 */
const FilterSheet = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (filter: string | null) => void;
}) => {
  const filters = ["전체", "식량", "의약품", "생필품"];

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`w-full bg-white rounded-t-2xl shadow-lg p-6 transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-4">필터 선택</h2>

        <div className="space-y-3">
          {filters.map((item) => (
            <button
              key={item}
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-700 font-medium"
              onClick={() => {
                onSelect(item === "전체" ? null : item);
                onClose();
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Goods = () => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 샘플 데이터
  const locations = [
    { lat: 37.5665, lng: 126.978, type: "식량", name: "서울 식량창고" },
    { lat: 37.567, lng: 126.979, type: "의약품", name: "서울 의약품센터" },
    { lat: 37.565, lng: 126.977, type: "생필품", name: "서울 생필품보관소" },
  ];

  // 마커 그리기 함수
  const drawMarkers = (filter: string | null) => {
    if (!mapRef.current || !window.kakao) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const filtered = filter
      ? locations.filter((loc) => loc.type === filter)
      : locations;

    filtered.forEach((loc) => {
      const markerPosition = new window.kakao.maps.LatLng(loc.lat, loc.lng);
      const marker = new window.kakao.maps.Marker({ position: markerPosition });
      marker.setMap(mapRef.current);

      window.kakao.maps.event.addListener(marker, "click", () => {
        setLocationName(loc.name);
        setOpen(true);
      });

      markersRef.current.push(marker);
    });
  };

  // 지도 로드
  useEffect(() => {
    const container = document.getElementById("map");
    if (!container) return;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=03df585402f446e56df2c3a211f3e2f8&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (!window.kakao) return;

      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        });
        mapRef.current = map;

        // ✅ 지도 준비 후 전체 마커 표시
        drawMarkers(null);
      });
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 필터 변경 시 마커 갱신
  useEffect(() => {
    drawMarkers(selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="w-full h-screen relative">
      {/* 상단 바 */}
      <div className="absolute top-0 left-0 w-full h-16 p-4 z-10 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-xl font-semibold">구호물품</h1>
        <div className="flex gap-2">
          <button onClick={() => setFilterOpen(true)}>
            <Filter size={20} />
          </button>
          <button>🔍</button>
        </div>
      </div>

      {/* 지도 */}
      <div id="map" className="absolute top-16 left-0 w-full bottom-16" />

      {/* 장소 정보 바텀시트 */}
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        locationName={locationName}
      />

      {/* 필터 바텀시트 */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onSelect={(f) => setSelectedFilter(f)}
      />
    </div>
  );
};

export default Goods;
