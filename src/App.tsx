import { Route, Routes } from 'react-router-dom';
import LayoutClient from './passe/LayoutClient/layout';
import Product from './passe/Client/Product';
import DetailProduct from './passe/Client/DetailProduct';
import Register from './passe/Client/Register';
import Login from './components/Client/login';
import CartProduct from './passe/Client/Cart';
import LayoutAdmin from './passe/LayoutAdmin/layout';
import Dashboard from './components/Admin/dashboard';
import ProductList from './components/Admin/products';
import AddProductForm from './components/Admin/addproduct';

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
        </Route>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/add" element={<AddProductForm />} />
          {/* <Route path="forms" element={<Forms />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="apps" element={<Apps />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
