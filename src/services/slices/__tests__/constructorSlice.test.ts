import { TIngredient } from '@utils-types';
import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
  TConstructorState
} from '../constructorSlice';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const bun: TIngredient = {
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
};

const filling: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'meat.png',
  image_large: 'meat-large.png',
  image_mobile: 'meat-mobile.png'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

describe('constructorReducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  it('добавляет булку в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual({ ...bun, id: 'test-uuid' });
    expect(state.ingredients).toHaveLength(0);
  });

  it('заменяет ранее добавленную булку', () => {
    const anotherBun = { ...bun, _id: 'bun-2', name: 'Флюоресцентная булка' };
    const withBun = constructorReducer(initialState, addIngredient(bun));
    const state = constructorReducer(withBun, addIngredient(anotherBun));

    expect(state.bun?._id).toBe('bun-2');
    expect(state.bun?.name).toBe('Флюоресцентная булка');
  });

  it('добавляет начинку в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...filling, id: 'test-uuid' }]);
  });

  it('удаляет начинку из конструктора', () => {
    const withFilling = constructorReducer(initialState, addIngredient(filling));
    const state = constructorReducer(
      withFilling,
      removeIngredient('test-uuid')
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('перемещает начинку в конструкторе', () => {
    let state = constructorReducer(initialState, addIngredient(filling));
    state = {
      ...state,
      ingredients: [
        { ...filling, id: 'first' },
        { ...sauce, id: 'second' }
      ]
    };

    state = constructorReducer(
      state,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'second',
      'first'
    ]);
  });

  it('не перемещает начинку при некорректном индексе', () => {
    const withFilling = constructorReducer(initialState, addIngredient(filling));
    const state = constructorReducer(
      withFilling,
      moveIngredient({ from: 0, to: 5 })
    );

    expect(state).toEqual(withFilling);
  });

  it('очищает конструктор', () => {
    let state = constructorReducer(initialState, addIngredient(bun));
    state = constructorReducer(state, addIngredient(filling));
    state = constructorReducer(state, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
