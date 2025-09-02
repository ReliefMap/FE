import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { loadKakaoMap } from '../../components/map/KakaoMap';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  locationName: string;
  onNavigate: () => void;
};

const BottomSheet = ({ open, onClose, locationName, onNavigate }: BottomSheetProps) => (
  <div
    className={`fixed inset-0 z-50 flex justify-center items-end transition ${
      open ? 'visible' : 'invisible'
    }`}
  >
    <div
      className={`absolute inset-0 bg-black/40 transition-opacity ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    />
    <div
      className={`w-full bg-white rounded-t-2xl shadow-lg p-4 transform transition-transform duration-300 ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
      onClick={onNavigate}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
      <h2 className="text-lg font-semibold mb-4">{locationName}</h2>
      <p className="text-sm text-gray-500">탭하면 지점 페이지로 이동</p>
    </div>
  </div>
);

type FilterSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (f: string | null) => void;
};

const FilterSheet = ({ open, onClose, onSelect }: FilterSheetProps) => {
  const filters = ['전체', '식량', '의약품', '생필품'];
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition ${
        open ? 'visible' : 'invisible'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`w-full bg-white rounded-t-2xl shadow-lg p-6 transform transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
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
                onSelect(item === '전체' ? null : item);
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
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const locations = [
    { storeId: 1, lat: 37.5665, lng: 126.978, type: '식량', name: '서울 식량창고' },
    { storeId: 2, lat: 37.567, lng: 126.979, type: '의약품', name: '서울 의약품센터' },
    { storeId: 3, lat: 37.565, lng: 126.977, type: '생필품', name: '서울 생필품보관소' },
  ];

  const drawMarkers = (filter: string | null, kakao: typeof window.kakao, map: any) => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const filtered = filter ? locations.filter((l) => l.type === filter) : locations;

    filtered.forEach((loc) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(loc.lat, loc.lng),
      });
      marker.setMap(map);
      kakao.maps.event.addListener(marker, 'click', () => {
        setLocationName(loc.name);
        setSelectedStoreId(loc.storeId);
        setOpen(true);
      });
      markersRef.current.push(marker);
    });
  };

  // Kakao 지도 초기화
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const kakao = await loadKakaoMap();

        const map = new kakao.maps.Map(mapRef.current!, {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        });
        mapInstanceRef.current = map;

        drawMarkers(selectedFilter, kakao, map);
      } catch (err) {
        console.error('카카오 지도 로드 실패:', err);
      }
    };

    initMap();
  }, []);

  // 필터 변경 시 마커 갱신
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao) return;
    drawMarkers(selectedFilter, window.kakao, mapInstanceRef.current);
  }, [selectedFilter]);

  const handleNavigate = () => {
    if (!selectedStoreId) return;
    setOpen(false);
    navigate(`/goods/${selectedStoreId}`, {
      state: { name: locationName },
    });
  };

  return (
    <div className="relative w-full h-screen">
      {/* 상단 바 */}
      <div className="absolute top-0 left-0 w-full h-16 p-4 z-10 flex justify-between items-center bg-[#fffdf6] shadow-md">
        <h1 className="text-xl font-semibold text-[#191600]">구호물품</h1>
        <div className="flex gap-2 text-[#191600]">
          <button onClick={() => setFilterOpen(true)}>
            <Filter size={20} />
          </button>
          <button>🔍</button>
        </div>
      </div>

      {/* 지도 영역 */}
      <div ref={mapRef} className="absolute top-16 left-0 w-full bottom-16" />

      {/* 바텀 시트 */}
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        locationName={locationName}
        onNavigate={handleNavigate}
      />

      {/* 필터 시트 */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onSelect={(f) => setSelectedFilter(f)}
      />
    </div>
  );
};

export default Goods;
