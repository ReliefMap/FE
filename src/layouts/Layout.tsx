import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  const location = useLocation();

  /*  TODO: 바텀내비 조건  */
  const navNotNeeded = location.pathname.includes('detail');

  return (
    <div className="w-full h-screen">
      <div className={navNotNeeded ? '' : 'pb-16'}>
        <Outlet />
      </div>
      {!navNotNeeded && <Navigation />}
    </div>
  );
};

export default Layout;
