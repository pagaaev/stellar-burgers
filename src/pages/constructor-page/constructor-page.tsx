import { useSelector } from '../../services/store';
import { getIngredientsLoading } from '@selectors';
import { ConstructorPageUI } from '@ui-pages';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
