import { TIngredient } from '@utils-types';
import {
  fetchIngredients,
  ingredientsReducer,
  TIngredientsState
} from '../ingredientsSlice';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  }
];

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('ingredientsReducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  it('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('сбрасывает ошибку при fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      { ...initialState, error: 'Ошибка загрузки' },
      { type: fetchIngredients.pending.type }
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      }
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('обрабатывает fetchIngredients.rejected с сообщением ошибки', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network Error' }
      }
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Network Error'
    });
  });

  it('обрабатывает fetchIngredients.rejected без сообщения ошибки', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      {
        type: fetchIngredients.rejected.type,
        error: {}
      }
    );

    expect(state.error).toBe('Не удалось загрузить ингредиенты');
    expect(state.isLoading).toBe(false);
  });
});
