import { configureStore } from '@reduxjs/toolkit';
import brandProductReducer from './slice/nameProduct';
import categoryProduct from './slice/categoryProduct';

export const store = configureStore({
  reducer: {
    brandProduct: brandProductReducer,
    category: categoryProduct,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
