import { useNavigate } from 'react-router-dom';
import NavigationButton from '../components/navigation/NavigationButton';
import { HiOutlineHome, HiOutlineMap, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';

const Navigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <section className="fixed w-full h-16 bottom-0">
      <nav className="bg-[#fffdf6] w-full h-16 mx-auto flex items-center justify-between rounded-t-lg">
        <div className="w-full max-w-5xl mx-auto px-11 flex items-center justify-between text-[#191600]">
          <NavigationButton
            Icon={HiOutlineHome}
            title="홈"
            isActive={location.pathname === '/' || location.pathname.includes('/home')}
            onClick={() => handleNavigation('/')}
          />
          <NavigationButton
            Icon={HiOutlineMap}
            title="재난지도"
            isActive={location.pathname.includes('/map')}
            onClick={() => handleNavigation('/map')}
          />
          <NavigationButton
            Icon={HiOutlineShoppingBag}
            title="구호물품"
            isActive={location.pathname.includes('/goods')}
            onClick={() => handleNavigation('/goods')}
          />
          <NavigationButton
            Icon={HiOutlineUser}
            title="마이페이지"
            isActive={location.pathname.includes('/mypage')}
            onClick={() => handleNavigation('/mypage')}
          />
        </div>
      </nav>
    </section>
  );
};

export default Navigation;