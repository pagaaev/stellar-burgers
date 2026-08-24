import { TOrdersData } from '@utils-types';

export type FeedInfoUIProps = {
  feed: Pick<TOrdersData, 'total' | 'totalToday'>;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
