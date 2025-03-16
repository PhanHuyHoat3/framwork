import { Route, Routes } from 'react-router-dom';
import LayoutClient from './passe/LayoutClient/layout';
import Product from './passe/Client/Product';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutClient />}>
          <Route path="/" element={<Product />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
