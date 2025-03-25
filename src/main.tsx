import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
{
  /* <h3 className="text-lg font-semibold mt-6">Sản phẩm trong đơn hàng</h3>
      {userCart ? (
        <ul className="flex flex-wrap gap-4 mt-2">
          {userCart.items.map((item: CartItem) => (
            <li
              key={item.productId}
              className="flex items-center gap-3 border p-2 rounded-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md"
              />
              <div className="w-[300px]">
                <strong className="line-clamp-1">{item.name}</strong> -{' '}
                <span className="text-gray-500">Màu: {item.color}</span>
                <p>
                  {item.quantity} x {item.price.toLocaleString()}₫
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-red-500">⚠️ Giỏ hàng của bạn đang trống.</p>
      )} */
}
