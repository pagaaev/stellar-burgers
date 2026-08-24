import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '@slices';
import {
  getIngredients,
  getUserOrders,
  getUserOrdersLoading
} from '@selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);
  const isLoading = useSelector(getUserOrdersLoading);
  const ingredients = useSelector(getIngredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if ((isLoading && !orders.length) || !ingredients.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
