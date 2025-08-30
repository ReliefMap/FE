import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 bg-white shadow">
        {/* 좌측 로고 */}
        <h1 
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ReliefMap
        </h1>

        {/* 우측 로그인 */}
        <button
          onClick={() => navigate("/login")}
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          로그인
        </button>
      </header>

      {/* 상단 지역 및 재난상황 */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center mb-2">
            <span className="text-red-500 mr-2">📍</span>
            <span className="font-medium">상암동</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
            현재 재난 상황
          </div>
        </div>

        {/* 버튼 4개 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/map")}
            className="bg-gray-200 rounded-lg h-28 flex items-center justify-center text-lg font-medium">
            재난 지도
          </button>
          <button
            onClick={() => navigate("/goods")}
            className="bg-gray-200 rounded-lg h-28 flex items-center justify-center text-lg font-medium relative">
            구호물품 예약
          </button>
          <button className="bg-gray-200 rounded-lg h-28 flex items-center justify-center text-lg font-medium">
            일단 빈 메뉴
          </button>
          <button
            onClick={() => navigate("/mypage")}
            className="bg-gray-200 rounded-lg h-28 flex items-center justify-center text-lg font-medium">
            마이 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
