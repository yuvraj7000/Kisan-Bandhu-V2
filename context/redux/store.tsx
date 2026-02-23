import { configureStore } from '@reduxjs/toolkit'
import reducers from './sclice'
export const store = configureStore({
  reducer: reducers,
})