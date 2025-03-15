import { Outlet } from 'react-router-dom';
import Home from '../Home';
import Footer from '../Footer';

export default function LayoutClient() {
  return (
    <>
      <Home />
      <Outlet />
      <Footer />
    </>
  );
}
