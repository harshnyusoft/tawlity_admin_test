import { Navigate, Outlet } from 'react-router-dom';
import masterStore from '../store/masterStore';

const PrivateRoute = () => {
  const token = masterStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute; 