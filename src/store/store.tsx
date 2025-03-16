import { configureStore } from '@reduxjs/toolkit';
import brandProductReducer from './slice/nameProduct';
import categoryProduct from './slice/categoryProduct';
import selectProduct  from './slice/selectProduct'

export const store = configureStore({
  reducer: {
    brandProduct: brandProductReducer,
    category: categoryProduct,
    select: selectProduct,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
