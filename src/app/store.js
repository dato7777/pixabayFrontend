import { configureStore } from '@reduxjs/toolkit';
import CategoriesSlice from './CategoriesSlice';

export const store = configureStore({
  reducer: {
    categories:CategoriesSlice,
  },
});
