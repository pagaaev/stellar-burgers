import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData } from '@selectors';

export const AppHeader: FC = () => {
  const user = useSelector(getUserData);

  return <AppHeaderUI userName={user?.name} />;
};
