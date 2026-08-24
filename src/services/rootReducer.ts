import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { userReducer } from './slices/userSlice';
import { ordersReducer } from './slices/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  user: userReducer,
  orders: ordersReducer
});
