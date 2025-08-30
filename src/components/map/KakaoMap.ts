// window.kakao 타입 선언
declare global {
  interface Window {
    kakao?: any; // 또는 kakao 타입을 정확히 지정 가능
  }
}

export const loadKakaoMap = (): Promise<typeof window.kakao> => {
  return new Promise((resolve, reject) => {
    if (window.kakao) {
      resolve(window.kakao);
      return;
    }

    const script = document.createElement("script");
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=03df585402f446e56df2c3a211f3e2f8&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = reject;

    document.head.appendChild(script);
  });
};
