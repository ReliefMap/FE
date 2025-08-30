import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#93c5fd] via-[#60a5fa] to-[#3b82f6]">
    {/* 헤더 */}
    <header className="flex items-center justify-between p-4 bg-[#fffdf6] shadow-sm">
      <h1 
        className="text-xl font-bold text-[#191600] cursor-pointer"
        onClick={() => navigate("/")}
      >
        ReliefMap
      </h1>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg font-medium text-sm hover:bg-[#2563eb] transition"
      >
        로그인
      </button>
    </header>

    {/* 내용 영역 */}
    <main className="p-4 mt-4">
      {/* 상단 지역 및 재난상황 카드 */}
      <div className="bg-[#fffdf6] rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center mb-2">
          <span className="text-red-500 mr-2">📍</span>
          <span className="font-bold text-[#191600] text-lg">상암동</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
          현재 재난 상황
        </div>
      </div>


      {/* 버튼 4개 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/map")}
          className="bg-[#fffdf6] hover:bg-[#f7f7f7] text-[#191600] rounded-xl h-28 flex items-center justify-center text-lg font-bold shadow-md transition transform hover:scale-105"
        >
          재난 지도
        </button>
        <button
          onClick={() => navigate("/goods")}
          className="bg-[#fffdf6] hover:bg-[#f7f7f7] text-[#191600] rounded-xl h-28 flex items-center justify-center text-lg font-bold shadow-md transition transform hover:scale-105"
        >
          구호물품 예약
        </button>
        <button
          className="bg-[#fffdf6] hover:bg-[#f7f7f7] text-[#191600] rounded-xl h-28 flex items-center justify-center text-lg font-bold shadow-md transition transform hover:scale-105"
        >
          일단 빈 메뉴
        </button>
        <button
          onClick={() => navigate("/mypage")}
          className="bg-[#fffdf6] hover:bg-[#f7f7f7] text-[#191600] rounded-xl h-28 flex items-center justify-center text-lg font-bold shadow-md transition transform hover:scale-105"
        >
          마이 페이지
        </button>
      </div>
    </main>
  </div>
  );
};

export default Home;
