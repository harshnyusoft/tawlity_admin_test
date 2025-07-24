import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { getAntdTheme } from './theme/theme';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserManagement/List';
import EditProfile from './pages/Profile/Edit';
import ChangePassword from './pages/Profile/ChangePassword';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import EditUser from './pages/UserManagement/Edit';
import UserDetails from './pages/UserManagement/View';
import useDirection from './hooks/useDirection';

function App() {
  const { i18n } = useTranslation();
  const { direction, isRTL } = useDirection();

  // Configure Ant Design for RTL
  const antdConfig = {
    ...getAntdTheme(),
    direction: direction,
  };

  return (
    <ConfigProvider theme={antdConfig} direction={direction}>
      <AntdApp>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}> {/* All routes inside here are protected */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="user-management">
                  <Route path="list" element={<UserList />} />
                  <Route path="edit/:id" element={<EditUser />} />
                  <Route path="view/:id" element={<UserDetails />} />
                </Route>
                <Route path="profile">
                  <Route path="edit" element={<EditProfile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </Router>

        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#4BB543',
                color: 'white',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ff4d4f',
                color: 'white',
              },
            },
          }}
        />
      </AntdApp>
    </ConfigProvider >
  );
}

export default App;