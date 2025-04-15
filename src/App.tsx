import { Route, Routes } from 'react-router-dom';
import LayoutClient from './passe/LayoutClient/layout';
import Product from './passe/Client/Product';
import DetailProduct from './passe/Client/DetailProduct';
import Register from './passe/Client/Register';
import Login from './components/Client/login';
import CartProduct from './passe/Client/Cart';
import Order from './passe/Client/Order';
import LayoutAdmin from './passe/LayoutAdmin/layout';
import Dashboard from './components/Admin/dashboard';
import ProductList from './components/Admin/products';
import AddProductForm from './components/Admin/addproduct';
import CategoryList from './components/Admin/category';
import AddCategoryForm from './components/Admin/addcategory';
import EditProductForm from './components/Admin/editproduct';
import EditCategoryForm from './components/Admin/editcategory';
import UserList from './components/Admin/user';
import OrderList from './components/Admin/order';
import Search1 from './passe/Client/Search';
import Lichsu from './passe/Client/Lichsu';

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
          <Route path="/search" element={<Search1 />} />
          <Route path="/lichsu" element={<Lichsu />} />
        </Route>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/add" element={<AddProductForm />} />
          <Route path="product/:id/edit" element={<EditProductForm />} />
          <Route path="category" element={<CategoryList />} />
          <Route path="category/add" element={<AddCategoryForm />} />
          <Route path="category/:id/edit" element={<EditCategoryForm />} />
          <Route path="user" element={<UserList />} />
          <Route path="order" element={<OrderList />} />
          {/* <Route path="forms" element={<Forms />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="apps" element={<Apps />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
