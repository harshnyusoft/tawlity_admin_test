import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { getAntdTheme } from './theme/theme';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserManagement/List';
import CreateUser from './pages/UserManagement/Create';
import EditProfile from './pages/Profile/Edit';
import ChangePassword from './pages/Profile/ChangePassword';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ConfigProvider theme={getAntdTheme()}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="user-management">
              <Route path="list" element={<UserList />} />
              <Route path="create" element={<CreateUser />} />
            </Route>
            <Route path="profile">
              <Route path="edit" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
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

    </ConfigProvider >
  );
}

export default App;