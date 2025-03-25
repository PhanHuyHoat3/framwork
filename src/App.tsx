import { Route, Routes } from 'react-router-dom';
import LayoutClient from './passe/LayoutClient/layout';
import Product from './passe/Client/Product';
import DetailProduct from './passe/Client/DetailProduct';
import Register from './passe/Client/Register';
import Login from './components/Client/login';
import CartProduct from './passe/Client/Cart';
import Order from './passe/Client/Order';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutClient />}>
          <Route path="/" element={<Product />} />
          <Route path="product/:id" element={<DetailProduct />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartProduct />} />
          <Route path="/checkout" element={<Order />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
