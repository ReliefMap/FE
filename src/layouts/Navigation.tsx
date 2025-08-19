import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationButton from '../components/navigation/NavigationButton';
import { HiOutlineHome, HiOutlineMap, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';

const Navigation = () => {
  const [activeButton, setActiveButton] = useState<string>('home');

  const navigate = useNavigate();

  const handleNavigation = (path: string, buttonName: string) => {
    setActiveButton(buttonName);
    navigate(path);
  };

  return (
    <section className="fixed w-full h-16 bottom-0">
      <nav className="bg-white w-full h-16 mx-auto flex items-center justify-between rounded-t-lg">
        <div className="w-full max-w-5xl mx-auto px-11 flex items-center justify-between">
          <NavigationButton
            Icon={HiOutlineHome}
            title="홈"
            isActive={activeButton === 'home'}
            onClick={() => handleNavigation('/', 'home')}
          />
          <NavigationButton
            Icon={HiOutlineMap}
            title="재난지도"
            isActive={activeButton === 'map'}
            onClick={() => handleNavigation('/map', 'map')}
          />
          <NavigationButton
            Icon={HiOutlineShoppingBag}
            title="구호물품"
            isActive={activeButton === 'goods'}
            onClick={() => handleNavigation('/goods', 'goods')}
          />
          <NavigationButton
            Icon={HiOutlineUser}
            title="마이페이지"
            isActive={activeButton === 'mypage'}
            onClick={() => handleNavigation('/mypage', 'mypage')}
          />
        </div>
      </nav>
    </section>
  );
};

export default Navigation;
