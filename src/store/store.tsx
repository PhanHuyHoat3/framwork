import { configureStore } from '@reduxjs/toolkit';
import brandProductReducer from './slice/nameProduct';
import categoryProduct from './slice/categoryProduct';
import selectProduct from './slice/selectProduct';
import idProduct from './slice/idProduct';
import registerReducer from './slice/register';
import authReducer from './slice/login';
import productReducer from './slice/Product';
import cartReducer from './slice/cartProduct';
import orderReducer from './slice/orderProduct';

export const store = configureStore({
  reducer: {
    brandProduct: brandProductReducer,
    category: categoryProduct,
    select: selectProduct,
    idProduct: idProduct,
    register: registerReducer,
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    order: orderReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
