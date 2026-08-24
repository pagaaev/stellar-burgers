import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import { useDispatch } from '../../services/store';
import { checkUserAuth, fetchIngredients } from '@slices';
import { formatOrderNumber } from '../../utils/constants';
import { useEffect } from 'react';
import clsx from 'clsx';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
  Location
} from 'react-router-dom';

const IngredientModal = () => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const OrderModal = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Modal title={`#${formatOrderNumber(id)}`} onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientPage = () => (
  <div className={styles.detailPageWrap}>
    <IngredientDetails />
  </div>
);

const OrderPage = () => {
  const { id } = useParams();

  return (
    <div className={styles.detailPageWrap}>
      <p
        className={clsx(
          'text',
          'text_type_digits-default',
          styles.detailHeader
        )}
      >
        #{formatOrderNumber(id)}
      </p>
      <OrderInfo />
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const background = (location.state as { background?: Location })?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:id' element={<OrderPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:id'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route path='/feed/:id' element={<OrderModal />} />
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route
            path='/profile/orders/:id'
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
