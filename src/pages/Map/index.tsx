// src/pages/Map/index.tsx
import { useRef, useState, useEffect } from "react";
import { loadKakaoMap } from "../../components/map/KakaoMap";

const BottomSheet = ({
  open,
  onClose,
  locationName,
}: {
  open: boolean;
  onClose: () => void;
  locationName: string;
}) => (
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
      <h2 className="text-lg font-semibold text-[#191600] mb-4">{locationName}</h2>
    </div>
  </div>
);

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const kakao = await loadKakaoMap();

        const map = new kakao.maps.Map(mapRef.current!, {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 4,
        });
        mapInstanceRef.current = map;

        const markerPosition = new kakao.maps.LatLng(37.5665, 126.978);
        const marker = new kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);

        kakao.maps.event.addListener(marker, "click", () => {
          setLocationName("서울 시청");
          setOpen(true);
        });
      } catch (err) {
        console.error("카카오 지도 로드 실패:", err);
      }
    };

    initMap();
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* 상단 바 */}
      <div className="absolute top-0 left-0 w-full h-16 p-4 z-10 flex justify-between items-center bg-[#fffdf6] shadow-md">
        <h1 className="text-xl font-semibold text-[#191600]">재난지도</h1>
      </div>

      {/* 지도 영역 */}
      <div ref={mapRef} className="absolute top-16 left-0 w-full bottom-16" />

      {/* 바텀 시트 */}
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        locationName={locationName}
      />
    </div>
  );
}
