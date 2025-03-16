import { Outlet } from 'react-router-dom';
import Footer from '../Client/Footer';
import Home from '../Client/Home';

export default function LayoutClient() {
  return (
    <>
      <Home />
      <Outlet />
      <Footer />
    </>
  );
}
