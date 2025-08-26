import { Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Map from './pages/Map';
import Goods from './pages/Goods';
import Mypage from './pages/Mypage';
import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/goods" element={<Goods />} />
        <Route path="/mypage" element={<Mypage />} />
      </Route>
    </Routes>
  );
};

export default Router;
