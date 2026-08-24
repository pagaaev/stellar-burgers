import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { logoutUser } from './userSlice';
import { getApiErrorMessage } from '../../utils/constants';

export type TOrdersState = {
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  userOrders: [],
  userOrdersLoading: false,
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  currentOrderLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return {
        _id: response.order._id,
        status: response.order.status,
        name: response.order.name,
        createdAt: response.order.createdAt,
        updatedAt: response.order.updatedAt,
        number: response.order.number,
        ingredients
      } as TOrder;
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Не удалось оформить заказ')
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Не удалось загрузить историю заказов')
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (!response.success || !response.orders.length) {
        return rejectWithValue('Заказ не найден');
      }
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Не удалось загрузить заказ')
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.userOrders = [action.payload, ...state.userOrders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userOrders = [];
        state.orderModalData = null;
        state.currentOrder = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.userOrders = [];
        state.orderModalData = null;
        state.currentOrder = null;
      });
  }
});

export const { clearOrderModal } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;

export const getUserOrders = (state: { orders: TOrdersState }) =>
  state.orders.userOrders;
export const getUserOrdersLoading = (state: { orders: TOrdersState }) =>
  state.orders.userOrdersLoading;
export const getOrderRequest = (state: { orders: TOrdersState }) =>
  state.orders.orderRequest;
export const getOrderModalData = (state: { orders: TOrdersState }) =>
  state.orders.orderModalData;
export const getCurrentOrder = (state: { orders: TOrdersState }) =>
  state.orders.currentOrder;
export const getCurrentOrderLoading = (state: { orders: TOrdersState }) =>
  state.orders.currentOrderLoading;
